import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookmarksPage from "./components/BookmarksPage";
import BottomNavBar from "./components/BottomNavBar";
import ChatRoomPage from "./components/ChatRoomPage";
import FollowingPage from "./components/FollowingPage";
import Header from "./components/Header";
import Home from './components/Home';
import MainChatPage from "./components/MainChatPage";
import ProfilePage from "./components/ProfilePage"

function App() {
  
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<MainChatPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/chatroom/:chatId" element={<ChatRoomPage />}/>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/following" element={<FollowingPage />} />
      </Routes>

      <BottomNavBar />
    </Router>
  );
}

export default App;
