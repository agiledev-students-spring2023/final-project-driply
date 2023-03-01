import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bookmarks from "./components/Bookmarks";
import BottomNavBar from "./components/BottomNavBar";
import Header from "./components/Header";
import Home from './components/Home';
import MainChatPage from "./components/MainChatPage";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<MainChatPage />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>

      <BottomNavBar />
    </Router>
  );
}

export default App;
