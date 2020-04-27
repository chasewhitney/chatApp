import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import socket from "./socket";
import * as serviceWorker from "./serviceWorker";


ReactDOM.render( <App client={socket()}/> , document.getElementById("root"));

if (module.hot) {
  module.hot.accept('./App', () => {
    // eslint-disable-next-line
    const NextApp = require('./App').default
    ReactDOM.render(
      <NextApp client={socket()}/>,
      document.getElementById("root")
    )
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
