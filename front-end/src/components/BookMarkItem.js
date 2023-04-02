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
      post.bookmarked = !ifBookmarked;
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
