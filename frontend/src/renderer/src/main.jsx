import { createRoot } from "react-dom/client";
// import "./index.css";
import './assets/base.css'
import App from "./app";
import { store } from "./redux/store/store";
import { Provider } from "react-redux";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
