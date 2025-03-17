import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io(
  "https://wireless-barcode-scanner-backend-production.up.railway.app"
);

const PCScreen = () => {
  const [uniqueKey, setUniqueKey] = useState("");
  const [products, setProducts] = useState([]);
  const tableRef = useRef(null); // Reference for the table

  useEffect(() => {
    const generatedKey = Math.random().toString(36).substring(2, 10);
    setUniqueKey(generatedKey);

    socket.emit("registerPC", generatedKey);

    socket.on("receiveBarcode", (barcode) => {
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

  const clearTable = () => {
    setProducts([]);
  };

  const totalSum = products.reduce(
    (sum, product) => sum + product.totalPrice,
    0
  );

  const printTable = () => {
    const printContent = tableRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML =
      `<style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background: #4a5568; color: white; }
      tfoot { background: #edf2f7; font-weight: bold; }
    </style>` + printContent;

    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          PC Barcode Scanner
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Unique Key:{" "}
          <span className="font-bold text-slate-600">{uniqueKey}</span>
        </p>

        <div
          ref={tableRef}
          className="overflow-x-auto border rounded-lg shadow-md"
        >
          <table className="w-full text-sm text-gray-700 bg-white">
            <thead className="bg-slate-600 text-white uppercase">
              <tr>
                <th className="py-3 px-4 border-x">#</th>
                <th className="py-3 px-4 border-x">Code</th>
                <th className="py-3 px-4 border-x">Name</th>
                <th className="py-3 px-4 border-x">Category</th>
                <th className="py-3 px-4 border-x">Unit Price</th>
                <th className="py-3 px-4 border-x">Quantity</th>
                <th className="py-3 px-4 border-x">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-2 px-4 border-x">{index + 1}</td>
                  <td className="py-2 px-4 border-x">{product.productCode}</td>
                  <td className="py-2 px-4 border-x">{product.productName}</td>
                  <td className="py-2 px-4 border-x">
                    {product.productCategory}
                  </td>
                  <td className="py-2 px-4 border-x">
                    ${product.productPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-x">
                    {product.productQuantity}
                  </td>
                  <td className="py-2 px-4 border-x">
                    ${product.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-200 font-semibold">
              <tr>
                <td className="py-3 px-4 text-right border-x" colSpan="6">
                  Total Sum:
                </td>
                <td className="py-3 px-4 border-x">${totalSum.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={clearTable}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Clear Table
          </button>
          <button
            onClick={printTable}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Print Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default PCScreen;
