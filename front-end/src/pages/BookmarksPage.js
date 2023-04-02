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
        const response = await fetch(`http://localhost:4000/bookmarks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({
          //     "userId": id
          // })
        });
        let json = await response.json();
        console.log(json);
        if (json.status === 200) {
          setBookmarkList(json.data);
          setBookmarkError(null);
          setLoading(false);
        } else {
          setBookmarkError({ error: json.error, status: json.status });
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
        <BookMarkItem post={bookmark}/>
        <div className="bookmarkImg">
          <img src={bookmark.image} alt="bookmark img" />
        </div>
        <div className="bookmarkTitle">{bookmark.title}</div>
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
            <h1 className="error">{bookmarkError.status}</h1>
            <h3 className="error">{bookmarkError.error}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
