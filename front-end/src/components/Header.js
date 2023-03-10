import React, { useContext } from 'react';
import { slide as Menu } from "react-burger-menu";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useScrollDirection } from '../hooks/useScrollDirection';

function Header(props) {

  const { ifDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const direction = useScrollDirection();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  let location = useLocation();
  let splitPath = location.pathname.split("/");
  let ifHide;
  if (splitPath.includes("chatroom") || splitPath.includes("editprofile")) {ifHide = true;}
  else {ifHide = false;}
  
  const logOut = (e) => {
    e.preventDefault();
    // setUser('');
    // setAuth(false);
    logout();
    navigate('trending');
  };


  return (
    
    <>
      {ifHide ? (
        <div></div>
      ) : user ? (
        <div className={`header ${direction === "down" ? "header-hide" : "header-show"} ${ifDarkMode && "header-Dark"}`}>
          <div className="logo">
            Logo
          </div>
          <Menu right={true} burgerBarClassName={`${ifDarkMode && "bm-burger-bars-dark"}`}>
            <Link to="/">Home</Link>
            <Link to="/chats">Messages</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/bookmarks">Bookmarks</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/" onClick={logOut}>Log Out</Link>
          </Menu>
        </div>
      ) : (
        <div className="header">
        <div className="logo">
          Logo
        </div>
        <Menu right={true}>
          <Link to="/login">Login</Link>
        </Menu>
      </div>
      )}
    </>
  )
}

export default Header;