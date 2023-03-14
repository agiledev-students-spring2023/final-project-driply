import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // not bookmarked
import BookmarkIcon from "@mui/icons-material/Bookmark"; // bookmarked
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // unliked post
import FavoriteIcon from "@mui/icons-material/Favorite"; // liked post
import ChatBubbleIcon from "@mui/icons-material/ChatBubble"; // comment icon

function Post({ post }) {
  const [ifBookmarked, setIfBookmarked] = useState(post.bookmarked);
  const [ifLiked, setIfLiked] = useState(post.liked);
  const navigate = useNavigate();

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    post.bookmarked = !ifBookmarked;
    setIfBookmarked(!ifBookmarked);
  };
  const handlePostLike = (e) => {
    e.stopPropagation();
    post.liked = !ifLiked;
    setIfLiked(!ifLiked);

    // update like count
    if (post.liked) {
      post.likes += 1;
    } else {
      post.likes -= 1;
    }
  };

  // this is just temp. to get different imgs and sizes
  const randomSize = [350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380];
  const randomIndex = Math.floor(Math.random() * randomSize.length);

  return (
    <div className="post">
      {/* header */}
      <div className="postHeader">
        <div className="postHeaderDetails">
          <Link to="/profile">
            <img src={post.user_picture} alt="user img" />
          </Link>
          <p onClick={() => navigate("/profile")}>{post.username}</p>
        </div>
        <p className="postCost">Total Cost: ${post.price}</p>
      </div>

      {/* width set 100%, height changes based on img */}
      {/* post pictures */}
      <div className="postBody">
        {/* <img src={post.post_picture} alt="post img"/> */}
        <Link to={`/post/0`}>
          <img src={`https://picsum.photos/${randomSize[randomIndex]}/300`} alt="postpic" />
        </Link>
        <div className="postBookmarkIcon">
          {ifBookmarked ? (
            <BookmarkIcon
              onClick={handleBookmarkClick}
              sx={{ height: "50px", width: "50px", color: "white" }}
            />
          ) : (
            <BookmarkBorderIcon
              onClick={handleBookmarkClick}
              sx={{ height: "50px", width: "50px" }}
            />
          )}
        </div>
        {/* post likes, comments */}
        <div className="postDetails">
          <div>
            {ifLiked ? (
              <FavoriteIcon onClick={handlePostLike} sx={{ color: "pink" }} />
            ) : (
              <FavoriteBorderIcon onClick={handlePostLike} />
            )}
            <p>{post.likes}</p>
          </div>
          <div>
            <ChatBubbleIcon />
            <p>{post.comments}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
