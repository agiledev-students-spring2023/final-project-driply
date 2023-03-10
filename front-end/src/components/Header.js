import React, { useState, useEffect, useRef, forwardRef } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useScrollDirection } from "../hooks/useScrollDirection";

const Header = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const direction = useScrollDirection();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  let location = useLocation();
  let splitPath = location.pathname.split("/");
  let ifHide;
  if (splitPath.includes("chatroom") || splitPath.includes("editprofile")) {
    ifHide = true;
  } else {
    ifHide = false;
  }

  // control menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    console.log("Header mounted");
    const handleClickOutside = (event) => {
      console.log("click outside");
      console.log(menuRef.current);
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        console.log(menuRef.current);
        console.log("close menu");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuRef]);

  const logOut = (e) => {
    e.preventDefault();
    // setUser('');
    // setAuth(false);
    logout();
    navigate("trending");
  };

  return (
    <>
      {ifHide ? (
        <div></div>
      ) : user ? (
        <div
          className={`header ${
            direction === "down" ? "header-hide" : "header-show"
          }`}
        >
          <div className="logo">Logo</div>
          <Menu
            right={true}
            isOpen={isMenuOpen}
            onStateChange={(state) => setIsMenuOpen(state.isOpen)}
            ref={menuRef}
            onClose={handleMenuClose}
          >
            <Link to="/" onClick={handleMenuClose}>
              Home
            </Link>
            <Link to="/chats" onClick={handleMenuClose}>
              Messages
            </Link>
            <Link to="/trending" onClick={handleMenuClose}>
              Trending
            </Link>
            <Link to="/bookmarks" onClick={handleMenuClose}>
              Bookmarks
            </Link>
            <Link to="/settings" onClick={handleMenuClose}>
              Settings
            </Link>
            <Link to="/" onClick={logOut}>
              Log Out
            </Link>
          </Menu>
        </div>
      ) : (
        <div className="header">
          <div className="logo">Logo</div>
          <Menu
            right={true}
            isOpen={isMenuOpen}
            onStateChange={(state) => setIsMenuOpen(state.isOpen)}
            ref={menuRef}
            onClose={handleMenuClose}
          >
            <Link to="/login" onClick={handleMenuClose}>
              Login
            </Link>
          </Menu>
        </div>
      )}
    </>
  );
});

export default Header;
