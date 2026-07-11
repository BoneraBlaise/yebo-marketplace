import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import Store from "./redux/store";
import { ThemeProvider } from "./context/ThemeContext";
import { setupApiClient } from "./config/setupApiClient";
import { logDevNetworkInfo } from "./config/devNetworkInfo";
import './i18n';

setupApiClient();
logDevNetworkInfo();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={Store}>
  <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);

reportWebVitals();
