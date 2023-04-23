import React, { useState, useEffect } from "react";
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
  const [pfp, setPfp] = useState();
  const [postUsername, setPostUsername] = useState();
  const [postImage, setPostImage] = useState();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    async function getDetails() {
      const response = await fetch(`http://localhost:4000/getUsername`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: post.user,
        }),
      });
      let json = await response.json();
      if (response.status === 200) {
        setPostUsername(json.username);

        const response2 = await fetch(`http://localhost:4000/getUserPfp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: post.user,
          }),
        });

        if (response2.status === 200) {
          const imageBlob = await response2.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setPfp(imageObjectURL);
          const response3 = await fetch(`http://localhost:4000/image`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filename: post.image,
            }),
          });
          if (response3.status === 200) {
            const imageBlob2 = await response3.blob();
            const imageObjectURL2 = URL.createObjectURL(imageBlob2);
            setPostImage(imageObjectURL2);
            if (user && post.likes.includes(user.id)) {
              setIfLiked(true);
            }
          }
        }
      }
    }

    getDetails();
  }, [post]);

  const handleBookmarkClick = (e) => {
    if (user) {
      // only bookmark post if logged in
      e.stopPropagation();

      async function addBookmark() {
        const response = await fetch(`http://localhost:4000/bookmark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postID: post._id,
            userID: user.id,
          }),
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log(json);
          if (json.message === "success") {
            setIfBookmarked(true);
            post.bookmarked = true;
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postID: post._id,
            userID: user.id,
          }),
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log(json);
          if (json.message === "success") {
            setIfBookmarked(false);
            post.bookmarked = false;
          }
        } else {
          // setPostError(response.status);
          // setLoading(false);
        }
      }
      if (ifBookmarked) {
        removeBookmark();
      } else {
        addBookmark();
      }
    } else {
      navigate("/login");
    }
  };

  const handlePostLike = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    const postId = post._id;
    const likeUrl = `http://localhost:4000/like/${postId}`;
    const unlikeUrl = `http://localhost:4000/unlike/${postId}`;

    if (ifLiked) {
      fetch(unlikeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
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
        body: JSON.stringify({
          userId: user.id,
        }),
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

  return (
    <div className="post">
      {/* header */}
      <div className="postHeader">
        <div className="postHeaderDetails">
          <Link to={`/profile/${post.user}`}>
            <img src={pfp} alt="user img" />
          </Link>
          <p onClick={() => navigate(`/profile/${post.user}`)}>
            {postUsername}
          </p>
        </div>
        <p className="postCost">Total Cost: ${post.price}</p>
      </div>

      {/* width set 100%, height changes based on img */}
      {/* post pictures */}
      <div className="postBody">
        {/* <img src={post.post_picture} alt="post img"/> */}

        <Link to={`/post/${post._id}`}>
          <img src={postImage} alt="postpic" />
        </Link>

        <div className="postDetails">
          <div className="postBookmarkIcon">
            {ifBookmarked ? (
              <BookmarkIcon
                onClick={handleBookmarkClick}
                sx={{ height: "40px", width: "40px", color: "white" }}
              />
            ) : (
              <BookmarkBorderIcon
                onClick={handleBookmarkClick}
                sx={{ height: "40px", width: "40px" }}
              />
            )}
          </div>
          <div>
            <div>
              <ChatBubbleIcon onClick={handleCommentClick} />
              <p>{post.comments.length}</p>
            </div>
            <div>
              {ifLiked ? (
                <FavoriteIcon
                  onClick={handlePostLike}
                  sx={{ color: "#cba2e2" }}
                />
              ) : (
                <FavoriteBorderIcon onClick={handlePostLike} />
              )}
              <p>{post.likes.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
