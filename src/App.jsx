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

function App() {
  return (
    <div>
      <h1>Supermarket Barcode System</h1>
      <PCBarcodeDisplay />
      <MobileBarcodeScanner />
    </div>
  );
}

export default App;
