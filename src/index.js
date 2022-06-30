import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App";
import "./styles/cs.scss";
import { Context } from "./Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Context>
    <App />
  </Context>
);
