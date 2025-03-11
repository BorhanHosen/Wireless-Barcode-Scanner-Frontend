import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import io from "socket.io-client";

const socket = io("wireless-barcode-scanner-backend-production.up.railway.app");

const MobileBarcodeScanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render((decodedText) => {
      socket.emit("barcodeScanned", { deviceId: "PC-1", barcode: decodedText });
    });

    return () => scanner.clear();
  }, []);

  return (
    <div>
      <h1>Mobile Barcode Scanner</h1>
      <div id="qr-reader" />
    </div>
  );
};

export default MobileBarcodeScanner;
