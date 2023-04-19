import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // not bookmarked
import BookmarkIcon from "@mui/icons-material/Bookmark"; // bookmarked

function BookMarkItem({ post }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [ifBookmarked, setIfBookmarked] = useState(post.bookmarked);

  const handleBookmarkClick = (e) => {
    if (user) {
      // only bookmark post if logged in
      e.stopPropagation();
      async function addBookmark() {
        const getUser = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(
          `http://localhost:4000/bookmark/${user.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postId: post._id,
              comment: post.comments,
            }),
          }
        );
        let json = await response.json();
        if (response.status === 200) {
          console.log(json);
          if (json.message === "success") {
            post.bookmarked = !ifBookmarked;
          }
        } else {
          // setPostError(response.status);
          // setLoading(false);
        }
      }
      async function removeBookmark() {
        const getUser = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(
          `http://localhost:4000/unbookmar/${user.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postId: post._id,
              comment: post.comments,
            }),
          }
        );
        let json = await response.json();
        if (response.status === 200) {
          console.log(json);
          if (json.message === "success") {
            post.bookmarked = !ifBookmarked;
          }
        } else {
          //setPostError(response.status);
          //setLoading(false);
        }
      }
      if (ifBookmarked) {
        removeBookmark();
      } else {
        addBookmark();
      }
      setIfBookmarked(!ifBookmarked);
    } else {
      // navigate user to login page
      navigate("/login");
    }
  };

  return (
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
  );
}

export default BookMarkItem;
