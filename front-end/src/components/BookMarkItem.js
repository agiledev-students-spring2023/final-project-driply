import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // not bookmarked
import BookmarkIcon from "@mui/icons-material/Bookmark"; // bookmarked

function BookMarkItem({ post, bookmarked, setBookmarked }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleBookmarkClick = async (e) => {
    if (user) {
      // only bookmark post if logged in
      e.stopPropagation();
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
          setBookmarked(true);
        }
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
      const response = await fetch(
        `http://localhost:4000/unbookmar/${post._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({
          //     "postId": id,
          //     "comment": comment
          // })
        }
      );
      let json = await response.json();
      if (response.status === 200) {
        console.log(json);
        if (json.message === "success") {
          setBookmarked(true);
        }
      } else {
        //setPostError(response.status);
        //setLoading(false);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="postBookmarkIcon">
      {bookmarked ? (
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
