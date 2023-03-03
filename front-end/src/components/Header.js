import React from 'react';
import { slide as Menu } from "react-burger-menu";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {useAuth} from '../AuthContext';

function Header(props) {
  const navigate = useNavigate();
  const {user, setUser} = useAuth();
  const {auth, setAuth} = useAuth();
  let location = useLocation();
  let splitPath = location.pathname.split("/");
  let ifHide;
  if (splitPath.includes("chatroom")) {ifHide = true;}
  else {ifHide = false;}
  
  const logOut = (e) => {
    e.preventDefault();
    setUser('');
    setAuth(false);
    navigate('trending');
  };


  return (
    
    <>
      {ifHide ? (
        <div></div>
      ) : auth ? (
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
            <Link to="/trending" onClick={logOut}>Log Out</Link>
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