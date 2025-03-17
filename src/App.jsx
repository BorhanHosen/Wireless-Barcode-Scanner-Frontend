import React from "react";
import BarcodeScanner from "./components/BarcodeScanner";
import PCScreen from "./components/PCScreen";

function App() {
  return (
    <div className="w-full h-screen">
      <div className="bg-slate-300 h-full flex flex-col items-center">
        <div>
          <h1 className="pt-10 text-4xl font-bold">
            Supermarket Barcode System
          </h1>
        </div>
        <div className="flex h-full py-5">
          <div className="w-1/2">
            <BarcodeScanner />
          </div>
          <div className="w-1/2">
            <PCScreen />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
