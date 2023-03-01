import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bookmarks from "./components/Bookmarks";
import Home from './components/Home';
import MainChatPage from "./components/MainChatPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<MainChatPage />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </Router>
  );
}

export default App;
