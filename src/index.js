import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "react-hot-toast";
import "@smastrom/react-rating/style.css";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { getProfile } from "./axios/axios";

const root = ReactDOM.createRoot(document.getElementById("root"));
if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
  store.dispatch(getProfile());
}
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster />
        <ToastContainer />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
