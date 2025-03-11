import React, { useRef, useEffect, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import scannerBeep from "../src/assets/scanner-beep.mp3";

const BarcodeScanner = ({ onScan }) => {
  const scanner = useRef(null);
  const lastScannedCode = useRef("");
  const lastScannedTime = useRef(0);

  const onScanSuccess = useCallback(
    (decodedText) => {
      const now = Date.now();
      // Prevent duplicate scans within 3 seconds
      if (
        decodedText === lastScannedCode.current &&
        now - lastScannedTime.current < 3000
      ) {
        return;
      }

      playBeep(); // Play beep sound

      // Trigger the function to fetch product data
      onScan(decodedText);

      // Update last scanned reference
      lastScannedCode.current = decodedText;
      lastScannedTime.current = now;
    },
    [onScan]
  );

  const onScanFailure = useCallback((error) => {
    console.warn("Scan error:", error);
  }, []);

  // Function to play beep sound
  const playBeep = () => {
    const beep = new Audio(scannerBeep);
    beep.play();
  };

  const startScanner = () => {
    if (!scanner.current) {
      scanner.current = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true,
      });

      scanner.current.render(onScanSuccess, onScanFailure);
    }
  };

  useEffect(() => {
    return () => {
      if (scanner.current) {
        scanner.current.clear().catch((error) => {
          console.error("Failed to clear scanner:", error);
        });
      }
    };
  }, []);

  return (
    <div className="container">
      <button onClick={startScanner} className="scan-button">
        Start Scanning
      </button>
      <div id="qr-reader" className="scanner-container" />
    </div>
  );
};

export default BarcodeScanner;
