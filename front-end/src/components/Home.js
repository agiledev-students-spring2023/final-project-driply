import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
        <Link to="/"><h1>Home</h1></Link>
        <Link to="/chats"><h1>Chats</h1></Link>
        <Link to="/bookmarks"><h1>Bookmarks</h1></Link>
    </div>
  )
}

export default Home;