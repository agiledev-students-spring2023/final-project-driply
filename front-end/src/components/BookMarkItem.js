import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // not bookmarked
import BookmarkIcon from "@mui/icons-material/Bookmark"; // bookmarked

function BookMarkItem({
  post,
  bookmarked,
  setBookmarked,
  removedBookmark,
  setRemovedBookmark,
}) {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleBookmarkClick = async (e) => {
    if (user) {
      // only bookmark post if logged in
      e.stopPropagation();
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
      } else {
        // setPostError(response.status);
        // setLoading(false);
      }
    } else {
      navigate("/login");
    }
  };

  const removeBookmark = async (e) => {
    if (user) {
      e.stopPropagation();
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
          setRemovedBookmark(post._id);
        }
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="postBookmarkIconBMpage">
      {bookmarked.includes(user.id) ? (
        <BookmarkIcon
          onClick={removeBookmark}
          sx={{ height: "40px", width: "40px", color: "white" }}
        />
      ) : (
        <BookmarkBorderIcon
          onClick={handleBookmarkClick}
          sx={{ height: "40px", width: "40px" }}
        />
      )}
    </div>
  );
}

export default BookMarkItem;
