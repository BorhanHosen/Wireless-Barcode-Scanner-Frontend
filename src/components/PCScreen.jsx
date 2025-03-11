import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(
  "https://wireless-barcode-scanner-backend-production.up.railway.app"
);

const PCScreen = () => {
  const [uniqueKey, setUniqueKey] = useState("");
  const [barcodes, setBarcodes] = useState([]);

  useEffect(() => {
    const generatedKey = Math.random().toString(36).substring(2, 10);
    setUniqueKey(generatedKey);

    socket.emit("registerPC", generatedKey);

    socket.on("receiveBarcode", (barcode) => {
      setBarcodes((prev) => [...prev, barcode]);
    });

    return () => {
      socket.off("receiveBarcode");
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">PC Screen</h1>
      <p>
        Unique Key: <strong>{uniqueKey}</strong>
      </p>
      <ul className="mt-4">
        {barcodes.map((barcode, index) => (
          <li key={index} className="p-2 border-b">
            {barcode}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PCScreen;
