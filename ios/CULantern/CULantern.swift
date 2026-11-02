import SwiftUI
import WebKit
import ARKit
import AVFoundation
import SafariServices

@main struct CULanternApp: App {
    var body: some Scene { WindowGroup { CUWebView().ignoresSafeArea(edges: .bottom) } }
}
struct CUWebView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> BrowserController { BrowserController() }
    func updateUIViewController(_ controller: BrowserController, context: Context) {}
}
final class BrowserController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {
    private var web: WKWebView!
    override func viewDidLoad() {
        super.viewDidLoad()
        let config = WKWebViewConfiguration()
        config.userContentController.add(self, name: "cuScanner")
        config.userContentController.add(self, name: "cuFiles")
        if let scriptURL = Bundle.main.url(forResource: "file-share", withExtension: "js"), let script = try? String(contentsOf: scriptURL, encoding: .utf8) {
            config.userContentController.addUserScript(WKUserScript(source: script, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        }
        web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = self
        view = web
        guard let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web") else { return }
        web.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
    }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        // Never expose the native bridge to a remote page.
        if let url = action.request.url, url.isFileURL, url.standardizedFileURL.path.hasPrefix(Bundle.main.bundleURL.path + "/") { decisionHandler(.allow) }
        else {
            decisionHandler(.cancel)
            if action.navigationType == .linkActivated, let url = action.request.url,
               url.scheme == "https", presentedViewController == nil {
                present(SFSafariViewController(url: url), animated: true)
            }
        }
    }
    func emit(_ name: String, _ detail: [String: Any]) {
        web.callAsyncJavaScript("window.dispatchEvent(new CustomEvent(name,{detail:payload}));", arguments: ["name":name,"payload":detail], in: nil, in: .page, completionHandler: nil)
    }
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame, let origin = message.frameInfo.request.url,
              origin.isFileURL, origin.standardizedFileURL.path.hasPrefix(Bundle.main.bundleURL.path + "/"),
              let body = message.body as? [String:String] else { return }
        if message.name == "cuFiles" { shareFile(body); return }
        guard message.name == "cuScanner", body["action"] == "scan", presentedViewController == nil else { return }
        guard ARWorldTrackingConfiguration.supportsFrameSemantics(.sceneDepth) else {
            emit("cu-native-status", ["message":"This device has no supported LiDAR. Use photos or manual measurements below."]); return
        }
        AVCaptureDevice.requestAccess(for: .video) { [weak self] allowed in DispatchQueue.main.async {
            guard let self = self else { return }
            guard allowed else { self.emit("cu-native-status", ["message":"Camera access is off. Enable it in iPhone Settings, or use manual dimensions."]); return }
            let scanner = ScannerController()
            scanner.modalPresentationStyle = .fullScreen
            scanner.finished = { [weak self] frames in
                self?.dismiss(animated: true) {
                    self?.emit("cu-native-status", ["message":frames.isEmpty ? "Scan cancelled." : "Scan captured. Review your views."])
                    if !frames.isEmpty { self?.emit("cu-native-frames", ["schema":"cu-native-depth-v1","frames":frames]) }
                }
            }
            self.present(scanner, animated: true)
        }}
    }
    private func shareFile(_ body: [String:String]) {
        guard presentedViewController == nil else { emit("cu-file-status", ["message":"Close the current screen and try exporting again."]); return }
        guard let name = body["name"], name.range(of: #"^[A-Za-z0-9][A-Za-z0-9._ -]{0,119}\.(zip|json|svg|dxf|html|txt|csv|pdf)$"#, options: [.regularExpression, .caseInsensitive]) != nil,
              let encoded = body["base64"], encoded.utf8.count <= 28_000_000,
              let data = Data(base64Encoded: encoded), data.count <= 20 * 1024 * 1024 else {
            emit("cu-file-status", ["message":"Export rejected: invalid filename or file size."]); return
        }
        let directory = FileManager.default.temporaryDirectory.appendingPathComponent("cu-export-" + UUID().uuidString, isDirectory: true)
        do {
            try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
            let file = directory.appendingPathComponent(name)
            try data.write(to: file, options: [.atomic, .completeFileProtection])
            let activity = UIActivityViewController(activityItems: [file], applicationActivities: nil)
            activity.popoverPresentationController?.sourceView = view
            activity.popoverPresentationController?.sourceRect = CGRect(x:view.bounds.midX,y:view.bounds.maxY-20,width:1,height:1)
            activity.completionWithItemsHandler = { [weak self] _, completed, _, error in
                try? FileManager.default.removeItem(at: directory)
                self?.emit("cu-file-status", ["message": error != nil ? "Export failed. Please try again." : (completed ? "File exported. No order or payment was placed." : "Export cancelled. Nothing was sent by CU.")])
            }
            present(activity, animated: true)
        } catch {
            try? FileManager.default.removeItem(at: directory)
            emit("cu-file-status", ["message":"Unable to prepare the file. Please try again."])
        }
    }

}
final class ScannerController: UIViewController, ARSessionDelegate {
    private let scene = ARSCNView()
    private let label = UILabel()
    private let capture = UIButton(type: .system)
    private let done = UIButton(type: .system)
    private var frames: [[String:Any]] = []
    private var lastTime: TimeInterval = -1
    private var capturePositions: [SIMD3<Float>] = []
    private let imageContext = CIContext()
    var finished: (([[String:Any]]) -> Void)?
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        scene.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scene)
        NSLayoutConstraint.activate([scene.topAnchor.constraint(equalTo:view.topAnchor),scene.bottomAnchor.constraint(equalTo:view.bottomAnchor),scene.leadingAnchor.constraint(equalTo:view.leadingAnchor),scene.trailingAnchor.constraint(equalTo:view.trailingAnchor)])
        scene.session.delegate = self
        label.text = "Keep the whole light and surrounding ceiling visible. Move slowly, then capture 2–6 different views."
        label.numberOfLines = 0; label.textColor = .white; label.textAlignment = .center
        capture.setTitle("Capture view", for:.normal); capture.addTarget(self, action:#selector(take), for:.touchUpInside)
        done.setTitle("Review in CU", for:.normal); done.isEnabled = false; done.addTarget(self, action:#selector(review), for:.touchUpInside)
        let cancel = UIButton(type:.system); cancel.setTitle("Cancel", for:.normal); cancel.addTarget(self, action:#selector(stop), for:.touchUpInside)
        let stack = UIStackView(arrangedSubviews:[label,capture,done,cancel]); stack.axis = .vertical; stack.spacing = 12; stack.backgroundColor = UIColor.black.withAlphaComponent(0.8); stack.isLayoutMarginsRelativeArrangement = true; stack.layoutMargins = UIEdgeInsets(top:16,left:16,bottom:16,right:16); stack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)
        NSLayoutConstraint.activate([stack.leadingAnchor.constraint(equalTo:view.safeAreaLayoutGuide.leadingAnchor,constant:12),stack.trailingAnchor.constraint(equalTo:view.safeAreaLayoutGuide.trailingAnchor,constant:-12),stack.bottomAnchor.constraint(equalTo:view.safeAreaLayoutGuide.bottomAnchor,constant:-8)])
        let config = ARWorldTrackingConfiguration(); config.frameSemantics = [.sceneDepth]
        scene.session.run(config)
    }
    override func viewWillDisappear(_ animated: Bool) { super.viewWillDisappear(animated); scene.session.pause() }
    @objc private func stop() { finished?([]) }
    @objc private func review() { if frames.count >= 2 { finished?(frames) } }
    func session(_ session: ARSession, didFailWithError error: Error) { DispatchQueue.main.async { self.label.text = "Camera session failed. Cancel and retry. " + error.localizedDescription; self.capture.isEnabled = false } }
    func sessionWasInterrupted(_ session: ARSession) { DispatchQueue.main.async { self.label.text = "Camera interrupted. Cancel and start a fresh scan."; self.capture.isEnabled = false } }
    @objc private func take() {
        guard frames.count < 12, let frame = scene.session.currentFrame, case .normal = frame.camera.trackingState,
              frame.timestamp - lastTime > 0.5, let depth = frame.sceneDepth, let confidence = depth.confidenceMap else { label.text = "Wait for tracking, hold steady, then capture another view."; return }
        let position = SIMD3<Float>(frame.camera.transform.columns.3.x, frame.camera.transform.columns.3.y, frame.camera.transform.columns.3.z)
        if capturePositions.contains(where: { simd_distance($0, position) < 0.03 }) {
            label.text = "Move sideways a little before capturing again. We need different viewpoints, not repeated pictures from the same position."; return
        }
        let map = depth.depthMap
        guard CVPixelBufferGetWidth(map) == 256, CVPixelBufferGetHeight(map) == 192,
              CVPixelBufferGetWidth(confidence) == 256, CVPixelBufferGetHeight(confidence) == 192 else { label.text = "Unsupported depth resolution. Use manual measurements."; return }
        CVPixelBufferLockBaseAddress(map,.readOnly); CVPixelBufferLockBaseAddress(confidence,.readOnly)
        defer { CVPixelBufferUnlockBaseAddress(map,.readOnly); CVPixelBufferUnlockBaseAddress(confidence,.readOnly) }
        guard let dbase = CVPixelBufferGetBaseAddress(map), let cbase = CVPixelBufferGetBaseAddress(confidence) else { return }
        var values = [Int](); var confidences = [Int](); values.reserveCapacity(49152); confidences.reserveCapacity(49152)
        for y in 0..<192 {
            let d = dbase.advanced(by:y * CVPixelBufferGetBytesPerRow(map)).assumingMemoryBound(to:Float32.self)
            let c = cbase.advanced(by:y * CVPixelBufferGetBytesPerRow(confidence)).assumingMemoryBound(to:UInt8.self)
            for x in 0..<256 { let mm = Double(d[x]) * 1000; values.append(mm.isFinite && mm > 0 && mm < 65535 ? Int(mm.rounded()) : 0); confidences.append(Int(c[x])) }
        }
        let image = CIImage(cvPixelBuffer:frame.capturedImage)
        let scaled = image.transformed(by:CGAffineTransform(scaleX:256/image.extent.width,y:192/image.extent.height))
        guard let cg = imageContext.createCGImage(scaled,from:CGRect(x:0,y:0,width:256,height:192)), let jpeg = UIImage(cgImage:cg).jpegData(compressionQuality:0.85) else { return }
        let k = frame.camera.intrinsics, resolution = frame.camera.imageResolution
        let sx = Float(256 / resolution.width), sy = Float(192 / resolution.height)
        frames.append(["frame":String(frames.count),"width":256,"height":192,"depthMm":values,"confidence":confidences,
                       "k":["fx":k.columns.0.x*sx,"fy":k.columns.1.y*sy,"cx":k.columns.2.x*sx,"cy":k.columns.2.y*sy],
                       "image":"data:image/jpeg;base64," + jpeg.base64EncodedString()])
        capturePositions.append(position)
        lastTime = frame.timestamp
        label.text = "\(frames.count) views captured. Move sideways for the next view; keep the rim, stem and ceiling visible."
        done.isEnabled = frames.count >= 2; capture.isEnabled = frames.count < 12
    }
}
