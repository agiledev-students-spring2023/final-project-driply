import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function BottomNavBar() {
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
        <div className="bottomNavBar">
            <Link to="/">Home</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/">Post</Link>
            <Link to="/profile">Profile</Link>
        </div>
      )}
    </>
  )
}

export default BottomNavBar;