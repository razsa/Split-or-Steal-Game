import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from "./App";
import AppV2 from "./AppV2";
import registerServiceWorker from "./registerServiceWorker";

// ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<AppV2 />, document.getElementById("root"));
registerServiceWorker();
