import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // not bookmarked
import BookmarkIcon from "@mui/icons-material/Bookmark"; // bookmarked
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // unliked post
import FavoriteIcon from "@mui/icons-material/Favorite"; // liked post
import ChatBubbleIcon from "@mui/icons-material/ChatBubble"; // comment icon

function Post({ post }) {
  const [ifBookmarked, setIfBookmarked] = useState(post.bookmarked);
  const [ifLiked, setIfLiked] = useState(post.liked);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleBookmarkClick = (e) => {
    if (user) {
      // only bookmark post if logged in
      e.stopPropagation();
      async function addBookmark() {
        const response = await fetch(`http://localhost:4000/bookmark`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          // body: JSON.stringify({
          //     "postId": id,
          //     "comment": comment
          // })
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log(json);
          if (json.message === "success"){
            post.bookmarked = !ifBookmarked;
          }
        } else {
          //setPostError(response.status);
          //setLoading(false);
        }
      }
      async function removeBookmark() {
        const response = await fetch(`http://localhost:4000/unbookmark`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({
            //     "postId": id,
            //     "comment": comment
            // })
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log(json);
          if (json.message === "success"){
            post.bookmarked = !ifBookmarked;
          }
        } else {
          // setPostError(response.status);
          // setLoading(false);
        }
      }
      if (ifBookmarked){
        removeBookmark();
      }
      else{
        addBookmark();
      }
      setIfBookmarked(!ifBookmarked);
    } else {
      // navigate user to login page
      navigate("/login");
    }
  };

  const handlePostLike = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    const postId = post.id;
    const likeUrl = `http://localhost:4000/like/${postId}`;
    const unlikeUrl = `http://localhost:4000/unlike/${postId}`;

    if (ifLiked) {
      fetch(unlikeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIfLiked(false);
            post.likes.length -= 1;
          } else {
            console.log(data.error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch(likeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIfLiked(true);
            post.likes.length += 1;
          } else {
            console.log(data.error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCommentClick = () => {
    if (user) {
      navigate("/post/0");
    } else {
      navigate("/login");
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
          <Link to={`/profile/${post.id}`}>
            <img src={post.user_picture} alt="user img" />
          </Link>
          <p onClick={() => navigate(`/profile/${post.id}`)}>{post.username}</p>
        </div>
        <p className="postCost">Total Cost: ${post.price}</p>
      </div>

      {/* width set 100%, height changes based on img */}
      {/* post pictures */}
      <div className="postBody">
        {/* <img src={post.post_picture} alt="post img"/> */}
        <Link to={`/post/0`}>
          <img
            src={`https://picsum.photos/${randomSize[randomIndex]}/300`}
            alt="postpic"
          />
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
            <p>{post.likes.length}</p>
          </div>
          <div>
            <ChatBubbleIcon onClick={handleCommentClick} />
            <p>{post.comments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
