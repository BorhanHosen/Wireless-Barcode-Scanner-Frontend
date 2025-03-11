import { useState, useEffect } from "react";
import { socket } from "./socket";
import BarcodeScanner from "./BarcodeScanner";

function SupermarketBilling() {
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    socket.on("productAdded", (newProduct) => {
      addProductToTable(newProduct);
    });

    return () => {
      socket.off("productAdded");
    };
  }, []);

  const addProductToTable = (product) => {
    setProducts((prev) => {
      const existingProduct = prev.find(
        (p) => p.productCode === product.productCode
      );
      if (existingProduct) {
        return prev.map((p) =>
          p.productCode === product.productCode
            ? {
                ...p,
                productQuantity: p.productQuantity + 1,
                totalPrice: (p.productQuantity + 1) * p.productPrice,
              }
            : p
        );
      } else {
        return [
          ...prev,
          { ...product, productQuantity: 1, totalPrice: product.productPrice },
        ];
      }
    });

    setTotalAmount((prev) => prev + product.productPrice);
  };

  const fetchProduct = async (productCode) => {
    if (!productCode.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:5000/products/${productCode}`
      );
      if (!response.ok) {
        alert("Product not found");
        return;
      }
      const product = await response.json();
      addProductToTable(product);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h1 className="text-xl font-bold mb-4">Supermarket Billing</h1>

        {/* Barcode Scanner Component */}
        <BarcodeScanner onScan={fetchProduct} />

        {/* Table */}
        <div className="h-60 overflow-y-auto border p-2 mb-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Unit Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{product.productCode}</td>
                  <td className="border p-2">{product.productName}</td>
                  <td className="border p-2">{product.productCategory}</td>
                  <td className="border p-2">
                    ${product.productPrice.toFixed(2)}
                  </td>
                  <td className="border p-2">{product.productQuantity}</td>
                  <td className="border p-2">
                    ${product.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="text-right text-xl font-bold mb-4">
          Total: ${totalAmount.toFixed(2)}
        </div>

        {/* Save & Print Buttons */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2">
          Save
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Print
        </button>
      </div>
    </div>
  );
}

export default SupermarketBilling;
