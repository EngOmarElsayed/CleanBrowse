//
//  SafariWebExtensionHandler.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/08/2026.

import BlurShieldKit
import os.log
import SafariServices

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    private static let logger = Logger(
        subsystem: Bundle.main.bundleIdentifier ?? "BlurShield",
        category: "classifier"
    )

    private static let classifier: NSFWClassifier? = {
        guard let url = Bundle.main.url(forResource: "BlurShieldNSFW", withExtension: "mlmodelc") else {
            logger.error("model missing from bundle")
            return nil
        }
        do {
            return try NSFWClassifier(compiledModelURL: url)
        } catch {
            logger.error("classifier init failed: \(String(describing: error), privacy: .public)")
            return nil
        }
    }()

    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems.first as? NSExtensionItem
        let message = item?.userInfo?[SFExtensionMessageKey] as? [String: Any]
        context.completeRequest(returningItems: [responseItem(for: message)])
    }

    private func responseItem(for message: [String: Any]?) -> NSExtensionItem {
        let result = handle(message)
        let response = NSExtensionItem()
        response.userInfo = [SFExtensionMessageKey: result]
        log(result)
        return response
    }

    // Scores contain no page data (no URL, no pixels), so .public is safe and
    // keeps them readable in Console.app: filter subsystem to the extension's
    // bundle id, category "classifier".
    private func log(_ result: [String: Any]) {
        if let scores = result["scores"] as? [String: Double] {
            let formatted = scores
                .sorted { $0.key < $1.key }
                .map { String(format: "%@=%.3f", $0.key, $0.value) }
                .joined(separator: " ")
            Self.logger.info("scores: \(formatted, privacy: .public)")
        } else if let error = result["error"] as? String {
            Self.logger.error("\(error, privacy: .public)")
        }
    }

    private func handle(_ message: [String: Any]?) -> [String: Any] {
        guard let classifier = Self.classifier else { return ["error": "model unavailable"] }
        guard let base64 = message?["jpegBase64"] as? String,
              let jpegData = Data(base64Encoded: base64) else {
            return ["error": "bad request"]
        }
        do {
            return ["scores": try classifier.classScores(jpegData: jpegData)]
        } catch {
            return ["error": "classification failed: \(error)"]
        }
    }
}
