"""Convert LukeJacob2023/nsfw-image-detector (ViT-base) to a CoreML FP16 mlpackage.

Input:  224x224 RGB image, normalization baked in ((x/255 - 0.5) / 0.5).
Output: classScores (float[1,5]) = softmax over the 5 classes, in id2label order:
        [drawings, hentai, neutral, porn, sexy].

Hard-fails if the model's label set is not exactly that, so downstream Swift
can safely hardcode the label order.
"""
import json
from pathlib import Path

import coremltools as ct
import torch
from transformers import AutoModelForImageClassification

MODEL_ID = "LukeJacob2023/nsfw-image-detector"
OUT = "Models/BlurShieldNSFW.mlpackage"
EXPECTED_LABELS = {"drawings", "hentai", "neutral", "porn", "sexy"}


class ClassScoresModel(torch.nn.Module):
    def __init__(self, vit):
        super().__init__()
        self.vit = vit

    def forward(self, pixel_values):
        logits = self.vit(pixel_values=pixel_values).logits
        return torch.softmax(logits, dim=-1)


def main():
    vit = AutoModelForImageClassification.from_pretrained(MODEL_ID).eval()
    id2label = {int(k): v for k, v in vit.config.id2label.items()}
    print("id2label:", id2label)
    if set(id2label.values()) != EXPECTED_LABELS:
        raise SystemExit(
            f"FATAL: unexpected label set {sorted(id2label.values())}; "
            f"expected {sorted(EXPECTED_LABELS)}"
        )

    labels_in_order = [id2label[i] for i in sorted(id2label)]
    dest = Path("Models/labels.json")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(labels_in_order, indent=2) + "\n")
    print(f"wrote {dest}: {labels_in_order}")

    wrapper = ClassScoresModel(vit).eval()
    example = torch.rand(1, 3, 224, 224)
    traced = torch.jit.trace(wrapper, example)

    # preprocessor_config.json for this model: image_mean=image_std=[0.5,0.5,0.5],
    # rescale 1/255 — identical to the Falconsai ViT, so keep (x/127.5 - 1).
    mlmodel = ct.convert(
        traced,
        inputs=[ct.ImageType(name="image", shape=(1, 3, 224, 224),
                             scale=1 / 127.5, bias=[-1.0, -1.0, -1.0],
                             color_layout=ct.colorlayout.RGB)],
        outputs=[ct.TensorType(name="classScores")],
        compute_precision=ct.precision.FLOAT16,
        minimum_deployment_target=ct.target.macOS14,
        convert_to="mlprogram",
    )
    mlmodel.save(OUT)
    print(f"saved {OUT}")


if __name__ == "__main__":
    main()
