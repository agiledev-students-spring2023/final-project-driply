import React from 'react';
import { slide as Menu } from "react-burger-menu";
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {useAuth} from '../context/AuthContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

function Header(props) {
  const navigate = useNavigate();
  // const {user, setUser} = useAuth();
  // const {auth, setAuth} = useAuth();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  let location = useLocation();
  let splitPath = location.pathname.split("/");
  let ifHide;
  if (splitPath.includes("chatroom")) {ifHide = true;}
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
        <div className="header">
          <div className="logo">
            Logo
          </div>
          <Menu right={true}>
            <Link to="/">Home</Link>
            <Link to="/chats">Messages</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/bookmarks">Bookmarks</Link>
            <Link to="/">Settings</Link>
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