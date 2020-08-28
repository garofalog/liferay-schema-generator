import React from "react";
import "./App.css";
// import SimpleDiagram from "./components/SimpleDiagram/";
// import SerializeDeserialize from "./components/SerializeDeserialize";
// import DiagramFromJson from "./components/DiagramFromJson";
// import ProgramaticallyModify from "./components/ProgramaticallyModify";
// import AutoLayoutDagre from "./components/AutoLayoutDagre";
import DbSchema from "./components/DbSchema";
import D3DbSchemaTool from "./components/D3SchemaTool"
// import DiagramFromD3Json from "./components/DiagramFromD3Json";


function App() {
  return (
    <div className="App">
      <D3DbSchemaTool />
      {/* <DbSchema /> */}
      {/* <DiagramFromD3Json /> */}
    </div>
  );
}

export default App;
