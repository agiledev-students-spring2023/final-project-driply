import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/chats.css";
import "./styles/profilepage.css";
import "./styles/following.css";
import "./styles/follower.css";
import "./styles/postform.css";
import "./styles/bookmarks.css";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
  // </React.StrictMode>
);
