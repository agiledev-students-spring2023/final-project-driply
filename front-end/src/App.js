import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookmarksPage from "./pages/BookmarksPage";
import BottomNavBar from "./components/BottomNavBar";
import ChatRoomPage from "./pages/ChatRoomPage";
import FollowingPage from "./pages/FollowingPage";
import FollowerPage from "./pages/FollowerPage";
import Header from "./components/Header";
import Home from "./pages/Home";
import MainChatPage from "./pages/MainChatPage";
import ProfilePage from "./pages/ProfilePage";
import SelfProfilePage from "./pages/SelfProfilePage";
import TrendingPage from "./pages/TrendingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PostPage from "./pages/PostPage";
import PostForm from "./pages/PostForm";
import SettingsPage from "./pages/SettingsPage";
import { useEffect } from "react";
import EditProfilePage from "./pages/EditProfilePage";

function App() {

  useEffect(() => {
    function checkDarkTheme() {
      const ifDarkTheme = JSON.parse(localStorage.getItem("darkTheme"));
      if (!ifDarkTheme) { // if it exist in local storage set default value
        localStorage.setItem("darkTheme", JSON.stringify(false)); // light mode as default value
      }
    }

    checkDarkTheme()
  }, []);

  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<MainChatPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/chatroom/:chatId" element={<ChatRoomPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/following" element={<FollowingPage />} />
        <Route path="/followers" element={<FollowerPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/postform" element={<PostForm />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/selfprofile" element={<SelfProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/editprofile" element={<EditProfilePage />} />
      </Routes>

      <BottomNavBar />
    </Router>
  );
}

export default App;
