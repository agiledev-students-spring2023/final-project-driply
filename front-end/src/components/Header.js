import React, { useContext, useState, useEffect, useRef } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useScrollDirection } from "../hooks/useScrollDirection";

function Header(props) {
  const { ifDarkMode } = useContext(DarkModeContext);
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

  const logOut = (e) => {
    e.preventDefault();
    // setUser('');
    // setAuth(false);
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
          <div className="logo" onClick={handleLogoClick}>
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
            itemClassName={`${ifDarkMode && "menu-item-dark"}`}
            menuClassName={`${ifDarkMode && "menu-dark"}`}
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
          <div className="logo" onClick={handleLogoClick}>
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
            <Link to="/login" onClick={handleMenuClose}>
              Login
            </Link>
            <Link to="/register" onClick={handleMenuClose}>
              Register
            </Link>
          </Menu>
        </div>
      )}
    </>
  );
}

export default Header;
