// import React from "react";
// import SupermarketBilling from "./SupermarketBilling";

// const App = () => {
//   return (
//     <div>
//       <SupermarketBilling />
//     </div>
//   );
// };

// export default App;
import React from "react";
import PCBarcodeDisplay from "./components/PCBarcodeDisplay";
import MobileBarcodeScanner from "./components/MobileBarcodeScanner";
import BarcodeScanner from "./components/BarcodeScanner";
import PCScreen from "./components/PCScreen";

function App() {
  return (
    <div className="w-full md:flex justify-center">
      <div className="md:w-1/2">
        <h1>Supermarket Barcode System</h1>
        <PCBarcodeDisplay />
        <MobileBarcodeScanner />
      </div>
      <div className="md:w-1/2 bg-slate-300">
        <h1>Supermarket Barcode System</h1>
        <PCScreen />
        <BarcodeScanner />
      </div>
    </div>
  );
}

export default App;
