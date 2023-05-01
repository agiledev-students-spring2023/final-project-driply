import React, { useContext, useState, useEffect, useRef } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useScrollDirection } from "../hooks/useScrollDirection";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

function Header(props) {
  const socket = useRef();
  const [unseenMessages, setUnseenMessages] = useState([]);
  const [toastCount, setToastCount] = useState(0);
  const { ifDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const direction = useScrollDirection();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  let location = useLocation();
  let splitPath = location.pathname.split("/");
  let ifHide;
  if (
    splitPath.includes("chatroom") ||
    splitPath.includes("editprofile") ||
    splitPath.includes("aboutus")
  ) {
    ifHide = true;
    if (splitPath.includes("chatroom")) {
    }
  } else {
    ifHide = false;
  }

  // control menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const logOut = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    logout();
    navigate("trending");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        console.log(menuRef.current);
        console.log("close menu");
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    if (getUser) {
      socket.current = io(`http://localhost:4000?userId=${getUser.id}`);
    }
  }, []);
  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    if (getUser) {
      socket.current.on(`updateChatHistory-${getUser.id}`, (data) => {
        const notification = JSON.parse(localStorage.getItem("notifications"));
        if (
          location.pathname !== `/chatroom/${data.newMessage.chatId}` &&
          notification === "on"
        ) {
          if (getUser.id !== data.newMessage.id_from) {
            if (toastCount > 0) {
              // only have 1 toast noti show and have the new toast replace old toast
              toast.dismiss();
            }

            // using css classes did not work. only worked with in line css or tailwind
            toast(
              (t) => (
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingLeft: "10px",
                      paddingRight: "20px",
                      maxWidth: "300px",
                      minWidth: "150px",
                    }}
                    onClick={() => {
                      navigate(`/chatroom/${data.newMessage.chatId}`);
                      toast.dismiss(t.id);
                    }}
                  >
                    <p style={{ fontWeight: 500 }}>
                      {data.newMessage.userFromName}
                    </p>
                    <p>{data.newMessage.message}</p>
                  </div>
                  <div
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                      color: "rgb(79 70 229)",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderLeft: "1px solid gray",
                    }}
                  >
                    Close
                  </div>
                </div>
              ),
              {
                duration: 3000,
              }
            );
            setToastCount((count) => count + 1);
            const message = data.newMessage.message;
            const newMsgObj = { message };
            setUnseenMessages((prev) => [...prev, newMsgObj]);
          }
        }
        if (
          getUser.id !== data.newMessage.id_from &&
          location.pathname !== `/chatroom/${data.newMessage.chatId}`
        ) {
          const unseen = JSON.parse(
            localStorage.getItem(`chatRoomId-${data.newMessage.chatId}`)
          );
          let incr;
          if (unseen) {
            incr = parseInt(unseen) + 1;
          } else {
            incr = 1;
          }
          localStorage.setItem(
            `chatRoomId-${data.newMessage.chatId}`,
            JSON.stringify(incr)
          );
        }
      });
    }

    return () => {
      socket.current.off(`updateChatHistory-${getUser.id}`);
    };
  }, [toastCount, location.pathname, navigate]);
  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === "/chats") {
      setUnseenMessages([]);
    }
  }, [location.pathname]);

  return (
    <>
      {ifHide ? (
        <div></div>
      ) : user ? (
        <div
          className={`header ${
            direction === "down" ? "header-hide" : "header-show"
          } ${ifDarkMode && "header-Dark"}`}
        >
          <img
            className="dlogo"
            alt="logo"
            src={ifDarkMode ? "/Driply-2.png" : "/Driply-1.png"}
            onClick={handleLogoClick}
          />
          <Menu
            noOverlay
            right={true}
            isOpen={isMenuOpen}
            onStateChange={(state) => setIsMenuOpen(state.isOpen)}
            ref={menuRef}
            onClose={handleMenuClose}
            burgerBarClassName={`${ifDarkMode && "bm-burger-bars-dark"}`}
            itemClassName={`${ifDarkMode && "menu-item-dark"}`}
            menuClassName={`${ifDarkMode && "menu-dark"}`}
          >
            <Link
              to="/"
              onClick={handleMenuClose}
            >
              Home
            </Link>
            <Link
              to="/chats"
              onClick={handleMenuClose}
            >
              Messages
            </Link>
            <Link
              to="/trending"
              onClick={handleMenuClose}
            >
              Trending
            </Link>
            <Link
              to="/bookmarks"
              onClick={handleMenuClose}
            >
              Bookmarks
            </Link>
            <Link
              to="/settings"
              onClick={handleMenuClose}
            >
              Settings
            </Link>
            <Link
              to="/"
              onClick={logOut}
            >
              Log Out
            </Link>
          </Menu>
          {unseenMessages.length > 0 ? (
            <div className="menuNotifications">
              <NotificationsIcon sx={{ fontSize: "30px" }} />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="header">
          <div
            className="logo"
            onClick={handleLogoClick}
          >
            Logo
          </div>
          <Menu
            noOverlay
            right={true}
            isOpen={isMenuOpen}
            onStateChange={(state) => setIsMenuOpen(state.isOpen)}
            ref={menuRef}
            onClose={handleMenuClose}
            burgerBarClassName={`${ifDarkMode && "bm-burger-bars-dark"}`}
            itemListClassName={`${ifDarkMode && "menu-item-dark"}`}
          >
            <Link
              to="/login"
              onClick={handleMenuClose}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={handleMenuClose}
            >
              Register
            </Link>
          </Menu>
        </div>
      )}
    </>
  );
}

export default Header;
