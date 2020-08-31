import React from "react";
import "./App.css";
// import SimpleDiagram from "./components/SimpleDiagram/";
// import SerializeDeserialize from "./components/SerializeDeserialize";
// import DiagramFromJson from "./components/DiagramFromJson";
// import ProgramaticallyModify from "./components/ProgramaticallyModify";
// import AutoLayoutDagre from "./components/AutoLayoutDagre";
import DbSchema from "./components/DbSchema";
import D3DbSchemaTool from "./components/D3SchemaTool"
import D3DbSchemaTool3D from "./components/D3SchemaTool3D"
// import DiagramFromD3Json from "./components/DiagramFromD3Json";

var style = {
  backgroundColor: "#fbfbfb"
};

function App() {
  return (
    <div className="App" style={style}>
      <D3DbSchemaTool />
      <D3DbSchemaTool3D />
      {/* <DbSchema /> */}
      {/* <DiagramFromD3Json /> */}
    </div>
  );
}

export default App;
