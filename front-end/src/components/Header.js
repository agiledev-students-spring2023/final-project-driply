import React from 'react';
import { slide as Menu } from "react-burger-menu";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="header">
      <div className="logo">
        Logo
      </div>
      <Menu right={true}>
        <Link to="/">Home</Link>
        <Link to="/">Messages</Link>
        <Link to="/">Trending</Link>
        <Link to="/">Bookmarks</Link>
        <Link to="/">Settings</Link>
      </Menu>
    </div>
  )
}

export default Header;