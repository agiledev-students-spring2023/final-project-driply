import React from "react";
import ReactDOM from "react-dom/client";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import "./styles/index.css";
import "./styles/chats.css";
import "./styles/profilepage.css";
import "./styles/following.css";
import "./styles/follower.css";
import "./styles/postform.css";
import "./styles/bookmarks.css";
import './styles/post.css';
import "./styles/settings.css";
import "./styles/trending.css";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./App";
import { DarkModeSwitchProvider } from "./context/DarkModeContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <DarkModeSwitchProvider>
      <App />
    </DarkModeSwitchProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
