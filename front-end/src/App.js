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
import TrendingPage from "./pages/TrendingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PostPage from "./pages/PostPage";
import PostForm from "./pages/PostForm";
import SettingsPage from "./pages/SettingsPage";
import { useEffect } from "react";
import EditProfilePage from "./pages/EditProfilePage";
import AboutUs from "./pages/AboutUs";
import { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    function checkDarkTheme() {
      const ifDarkTheme = JSON.parse(localStorage.getItem("darkTheme"));
      const notification = JSON.parse(localStorage.getItem("notifications"));
      if (!ifDarkTheme) {
        // if it doesnt exist in local storage set default value
        localStorage.setItem("darkTheme", JSON.stringify(false)); // light mode as default value
      }
      if (!notification) {
        // if it doesnt exist in local storage set default value
        localStorage.setItem("notifications", JSON.stringify("on")); // notis on as default value
      }
    }

    checkDarkTheme();
  }, []);

  return (
    <Router>
      <Header />
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/chats"
          element={<MainChatPage />}
        />
        <Route
          path="/bookmarks"
          element={<BookmarksPage />}
        />
        <Route
          path="/chatroom/:chatId"
          element={<ChatRoomPage />}
        />
        <Route
          path="/profile/:userId"
          element={<ProfilePage />}
        />
        <Route
          path="/following/:userId"
          element={<FollowingPage />}
        />
        <Route
          path="/followers/:userId"
          element={<FollowerPage />}
        />
        <Route
          path="/trending"
          element={<TrendingPage />}
        />
        <Route
          path="/postform"
          element={<PostForm />}
        />
        <Route
          path="/post/:postId"
          element={<PostPage />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />
        <Route
          path="/settings"
          element={<SettingsPage />}
        />
        <Route
          path="/editprofile"
          element={<EditProfilePage />}
        />
        <Route
          path="aboutus"
          element={<AboutUs />}
        />
      </Routes>

      <BottomNavBar />
    </Router>
  );
}

export default App;
