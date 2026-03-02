//
//  main.swift
//  proxy
//
//  Created by Omar Elsayed on 24/02/2026.
//

import Foundation
import NetworkExtension
import os

let log = Logger(subsystem: "com.omarelsayed.cleanbrowse.network-extension", category: "dns")

func main() -> Never {
    autoreleasepool {
        log.debug("first light")
        NEProvider.startSystemExtensionMode()
    }
    dispatchMain()
}

main()
