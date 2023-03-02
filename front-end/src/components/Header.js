import React from 'react';
import { slide as Menu } from "react-burger-menu";
import { Link, useLocation } from 'react-router-dom';

function Header() {
  let location = useLocation();
  let splitPath = location.pathname.split("/");
  let ifHide;
  if (splitPath.includes("chatroom")) {ifHide = true;}
  else {ifHide = false;}
  
  return (
    
    <>
      {ifHide ? (
        <div></div>
      ) : (
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
      )}
    </>
  )
}

export default Header;