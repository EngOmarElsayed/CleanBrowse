import CoreGraphics
import CoreML
import Foundation
import ImageIO

public enum NSFWClassifierError: Error {
    case undecodableImage
    case unexpectedModelOutput
}

public final class NSFWClassifier {
    /// Index -> label order of the model's classScores output.
    /// Tools/convert_model.py hard-fails the conversion if the model's
    /// id2label order ever differs from this, so hardcoding is safe.
    public static let labels = ["drawings", "hentai", "neutral", "porn", "sexy"]

    private let model: MLModel
    private let inputName: String
    private let outputName: String
    private let imageConstraint: MLImageConstraint

    public init(compiledModelURL: URL) throws {
        let configuration = MLModelConfiguration()
        configuration.computeUnits = .all
        model = try MLModel(contentsOf: compiledModelURL, configuration: configuration)

        let description = model.modelDescription
        guard let input = description.inputDescriptionsByName.first(where: { $0.value.type == .image }),
              let constraint = input.value.imageConstraint,
              let output = description.outputDescriptionsByName.keys.first else {
            throw NSFWClassifierError.unexpectedModelOutput
        }
        inputName = input.key
        imageConstraint = constraint
        outputName = output
    }

    public func classScores(jpegData: Data) throws -> [String: Double] {
        guard let source = CGImageSourceCreateWithData(jpegData as CFData, nil),
              let cgImage = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
            throw NSFWClassifierError.undecodableImage
        }
        let value = try MLFeatureValue(cgImage: cgImage, constraint: imageConstraint)
        let input = try MLDictionaryFeatureProvider(dictionary: [inputName: value])
        let output = try model.prediction(from: input)
        guard let scores = output.featureValue(for: outputName)?.multiArrayValue,
              scores.count == Self.labels.count else {
            throw NSFWClassifierError.unexpectedModelOutput
        }
        var result = [String: Double](minimumCapacity: Self.labels.count)
        for (index, label) in Self.labels.enumerated() {
            result[label] = scores[index].doubleValue
        }
        return result
    }
}
