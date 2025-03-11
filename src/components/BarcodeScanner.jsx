import React, { useState } from "react";
import { io } from "socket.io-client";
import { Html5QrcodeScanner } from "html5-qrcode";

const socket = io(
  "https://wireless-barcode-scanner-backend-production.up.railway.app"
);

const BarcodeScanner = () => {
  const [uniqueKey, setUniqueKey] = useState("");
  const [scanner, setScanner] = useState(null);

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
      },
      (error) => console.warn("Scan error:", error)
    );

    setScanner(html5QrcodeScanner);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Mobile Scanner</h1>
      <input
        type="text"
        placeholder="Enter PC Key"
        className="border p-2"
        value={uniqueKey}
        onChange={(e) => setUniqueKey(e.target.value)}
      />
      <button
        onClick={startScanner}
        className="bg-blue-500 text-white p-2 mt-2"
      >
        Start Scanning
      </button>
      <div id="qr-reader" className="mt-4"></div>
    </div>
  );
};

export default BarcodeScanner;
