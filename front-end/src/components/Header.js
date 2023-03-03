import React from 'react';
import { slide as Menu } from "react-burger-menu";
import { Link, useLocation } from 'react-router-dom';
import {useAuth} from '../AuthContext';

function Header(props) {
  const { auth } = useAuth();
  let location = useLocation();
  let splitPath = location.pathname.split("/");
  let ifHide;
  if (splitPath.includes("chatroom")) {ifHide = true;}
  else {ifHide = false;}
  
  return (
    
    <>
      {auth ? (
        <div className="header">
          <div className="logo">
            Logo
          </div>
          <Menu right={true}>
            <Link to="/">Home</Link>
            <Link to="/chats">Messages</Link>
            <Link to="/">Trending</Link>
            <Link to="/bookmarks">Bookmarks</Link>
            <Link to="/">Settings</Link>
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