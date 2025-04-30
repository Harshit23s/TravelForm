import { useState } from "react";
import TravelForm from "./components/TravelForm";
import TravelDataTable from "./components/TravelDataTable";
import "./App.css";

function App() {
  return (
    <div className="App">
      <TravelForm />
      <TravelDataTable />
    </div>
  );
}

export default App;
