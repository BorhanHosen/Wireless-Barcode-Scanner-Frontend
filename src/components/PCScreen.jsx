import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(
  "https://wireless-barcode-scanner-backend-production.up.railway.app"
);

const PCScreen = () => {
  const [uniqueKey, setUniqueKey] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const generatedKey = Math.random().toString(36).substring(2, 10);
    setUniqueKey(generatedKey);

    socket.emit("registerPC", generatedKey);

    socket.on("receiveBarcode", (barcode) => {
      setBarcodes((prev) => [...prev, barcode]);
      fetchProduct(barcode);
    });

    return () => {
      socket.off("receiveBarcode");
    };
  }, []);

  const fetchProduct = async (barcode) => {
    try {
      const response = await fetch(
        `https://wireless-barcode-scanner-backend-production.up.railway.app/products/${barcode}`
      );
      if (!response.ok) throw new Error("Product not found");
      const data = await response.json();
      setProducts((prev) => [...prev, data]);
    } catch (error) {
      setProducts([]);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">PC Screen</h1>
      <p>
        Unique Key: <strong>{uniqueKey}</strong>
      </p>
      <ul className="mt-4">
        {products.map((product, productIndex) => (
          <li
            key={` ${product.productName}-${productIndex}`}
            className="p-2 border-b"
          >
            {product.productCode}-{product.productName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PCScreen;
