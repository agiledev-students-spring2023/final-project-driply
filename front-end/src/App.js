import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookmarksPage from "./pages/BookmarksPage";
import BottomNavBar from "./components/BottomNavBar";
import ChatRoomPage from "./pages/ChatRoomPage";
import FollowingPage from "./pages/FollowingPage";
import Header from "./components/Header";
import Home from './pages/Home';
import MainChatPage from "./pages/MainChatPage";
import ProfilePage from "./pages/ProfilePage"
import TrendingPage from "./pages/TrendingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import PostPage from "./pages/PostPage"

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
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/post/:postId" element={<PostPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
      </Routes>

      <BottomNavBar />
    </Router>
  );
}

export default App;
