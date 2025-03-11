import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(
  "https://wireless-barcode-scanner-backend-production.up.railway.app"
);

const PCBarcodeDisplay = () => {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    socket.emit("registerPC", "PC-1");

    socket.on("barcodeReceived", (scannedBarcode) => {
      setBarcode(scannedBarcode);
      fetchProduct(scannedBarcode);
    });

    return () => socket.off("barcodeReceived");
  }, []);

  const fetchProduct = async (barcode) => {
    try {
      const response = await fetch(
        `https://wireless-barcode-scanner-backend-production.up.railway.app/products/${barcode}`
      );
      if (!response.ok) throw new Error("Product not found");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setProduct(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold">Scanned Barcode: {barcode}</h1>
      {product ? (
        <div>
          <p>
            <strong>Product Name:</strong> {product.productName}
          </p>
          <p>
            <strong>Category:</strong> {product.productCategory}
          </p>
          <p>
            <strong>Price:</strong> ${product.productPrice}
          </p>
        </div>
      ) : (
        <p>No product found</p>
      )}
    </div>
  );
};

export default PCBarcodeDisplay;
