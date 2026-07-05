import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import Store from "./redux/store";
import { ThemeProvider } from "./context/ThemeContext";
import './i18n'; // Import the i18n configuration

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={Store}>
  <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);

reportWebVitals();
