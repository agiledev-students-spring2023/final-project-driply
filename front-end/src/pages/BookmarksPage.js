import React, { useContext, useEffect, useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookMarkItem from "../components/BookMarkItem";
import { useAuthContext } from "../hooks/useAuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { useNavigate } from "react-router-dom";

function Bookmarks() {
  const { ifDarkMode } = useContext(DarkModeContext);
  const [bookmarkList, setBookmarkList] = useState([]);
  const [bookmarkError, setBookmarkError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handlePostClick = () => navigate("/post/0");

  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchBookmarkList() {
      if (user) {
        const response = await fetch(`http://localhost:4000/bookmarks/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        let json = await response.json();
        console.log(json);
        if (json.success) {
          setBookmarkList(json.bookmarks);
          setBookmarkError(null);
          setLoading(false);
        } else {
          setBookmarkError({ error: json.message });
          setLoading(false);
        }
      }
    }

    fetchBookmarkList();
  }, [user]);

  function LoadingBookmarkList() {
    return Array.from({ length: 4 }).map((_, idx) => {
      return <div key={idx} className="bookmarkItem bookmarkBgColor"></div>;
    });
  }

  function BookmarkItem({ bookmark }) {
    return (
      <div onClick={handlePostClick} className="bookmarkItem">
        {/* commented out until api route and db working */}
        {/* <BookMarkItem post={bookmark}/> */}
        <div className="bookmarkImg">
          <img src={bookmark?.image} alt="bookmark img" />
        </div>
      </div>
    );
  }

  function DisplayBookmarkList() {
    return (
      <>
        {bookmarkList?.map((item) => (
          <BookmarkItem key={item.id} bookmark={item} />
        ))}
      </>
    );
  }

  function NotLoggedInDisplay() {
    return (
      <div className="notLoggedInBookmark">
        <h2>You are not logged in</h2>

        <div className="displayLogInBtn">Login</div>
      </div>
    );
  }

  return (
    <div className={`bookmarkPage ${ifDarkMode && "darkTheme"}`}>
      {/* header */}
      <div className="bookmarkPageHeader">
        <h1>Bookmarks</h1>
      </div>

      {/* body */}
      <div className="displayAllBookmarks">
        {!user ? (
          <NotLoggedInDisplay />
        ) : loading ? (
          <LoadingBookmarkList />
        ) : bookmarkList.length === 0 && !bookmarkError ? (
          <h3>No bookmarks</h3>
        ) : (
          <DisplayBookmarkList />
        )}
        {bookmarkError && user && (
          <div>
            <h3 className="error">{bookmarkError.error}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
