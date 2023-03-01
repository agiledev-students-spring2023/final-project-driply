import React from 'react';
import { Link } from 'react-router-dom';

function BottomNavBar() {
  return (
    <div className="bottomNavBar">
        <Link to="/">Home</Link>
        <Link to="/">Trending</Link>
        <Link to="/">Post</Link>
        <Link to="/">Profile</Link>
    </div>
  )
}

export default BottomNavBar;