import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import socket from "./socket";

ReactDOM.render( <App client={socket()}/> , document.getElementById("root"));
