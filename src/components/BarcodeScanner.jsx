import React, { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Html5QrcodeScanner } from "html5-qrcode";
import scannerBeep from "../assets/scanner-beep.mp3";

const socket = io(
  "https://wireless-barcode-scanner-backend-production.up.railway.app"
);

const BarcodeScanner = () => {
  const [uniqueKey, setUniqueKey] = useState("");
  const [scannedCodes, setScannedCodes] = useState([]);
  const [scanner, setScanner] = useState(null);
  const lastScannedCode = useRef("");
  const lastScannedTime = useRef(0);

  const onScanSuccess = useCallback(
    (decodedText) => {
      const now = Date.now();
      if (
        decodedText === lastScannedCode.current &&
        now - lastScannedTime.current < 3000
      ) {
        return;
      }

      setScannedCodes((prev) => [
        ...prev,
        { code: decodedText, timestamp: new Date(now).toLocaleString() },
      ]);

      socket.emit("scanBarcode", { uniqueKey, barcode: decodedText });

      lastScannedCode.current = decodedText;
      lastScannedTime.current = now;
    },
    [uniqueKey]
  );

  const onScanFailure = useCallback((error) => {
    console.warn("Scan error:", error);
  }, []);

  const playBeep = () => {
    const beep = new Audio(scannerBeep);
    beep.play();
  };

  const startScanner = () => {
    if (!uniqueKey.trim()) {
      alert("Enter a unique key to connect to PC!");
      return;
    }

    const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
      rememberLastUsedCamera: true,
    });

    html5QrcodeScanner.render(
      (decodedText) => {
        console.log("Scanned:", decodedText);
        socket.emit("scanBarcode", { uniqueKey, barcode: decodedText });
        playBeep();
      },
      onScanSuccess,
      onScanFailure
    );
    setScanner(html5QrcodeScanner);
  };

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch((error) => {
          console.error("Failed to clear scanner:", error);
        });
      }
    };
  }, [scanner]);

  return (
    <div className="p-6 bg-gray-100 h-full flex flex-col items-center">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Mobile Barcode Scanner
        </h1>
        <input
          type="text"
          placeholder="Enter PC Key"
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={uniqueKey}
          onChange={(e) => setUniqueKey(e.target.value)}
        />
        <button
          onClick={startScanner}
          disabled={scanner}
          className={`w-full p-3 text-white font-semibold rounded-lg transition ${
            scanner
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {scanner ? "Scanning..." : "Start Scanning"}
        </button>
        <div
          id="qr-reader"
          className="mt-6 border rounded-lg shadow-md p-4 bg-gray-50"
        ></div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
