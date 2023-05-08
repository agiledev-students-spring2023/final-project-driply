import React, { useContext, useEffect, useState } from "react";
import BookMarkItem from "../components/BookMarkItem";
import { useAuthContext } from "../hooks/useAuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { useNavigate } from "react-router-dom";

function Bookmarks() {
  const { ifDarkMode } = useContext(DarkModeContext);
  const [bookmarkList, setBookmarkList] = useState([]);
  const [bookmarkError, setBookmarkError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removedBookmark, setRemovedBookmark] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuthContext();

  async function fetchPostImage(file) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: file,
      }),
    });

    if (response.status === 200) {
      const imageBlob = await response.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      return imageObjectURL;
    }
  }

  useEffect(() => {
    async function fetchBookmarkList() {
      const getUser = JSON.parse(localStorage.getItem("user"));
      if (getUser) {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/bookmarks/${getUser.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let json = await response.json();
        if (json.success) {
          for (let i = 0; i < json.bookmarks.length; i++) {
            const currentBookmark = json.bookmarks[i];
            const url = await fetchPostImage(currentBookmark.image);
            json.bookmarks[i].image = url;
          }
          console.log(json);

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

  useEffect(() => {
    if (removedBookmark) {
      setBookmarkList((prevState) =>
        prevState.filter((bookmark) => bookmark._id !== removedBookmark)
      );
    }
  }, [removedBookmark]);

  function LoadingBookmarkList() {
    return Array.from({ length: 4 }).map((_, idx) => {
      return (
        <div
          key={idx}
          className="bookmarkItem bookmarkBgColor"
        ></div>
      );
    });
  }

  function BookmarkItem({ bookmark }) {
    const [bookmarked, setBookmarked] = useState(bookmark.bookmarked);
    const handlePostClick = () => navigate(`/post/${bookmark._id}`);
    let text = bookmark?.description;
    if (text.length > 15) {
      text = text.substring(0, 15) + "...";
    }

    return (
      <div
        onClick={handlePostClick}
        className="bookmarkItem"
      >
        {/* commented out until api route and db working */}
        <BookMarkItem
          post={bookmark}
          bookmarked={bookmarked}
          setBookmarked={setBookmarked}
          setRemovedBookmark={setRemovedBookmark}
        />
        <div className="bookmarkImg">
          <img
            src={bookmark?.image}
            alt="bookmark img"
          />
        </div>
        <p>{text}</p>
      </div>
    );
  }

  function DisplayBookmarkList() {
    return (
      <>
        {bookmarkList?.map((item) => (
          <BookmarkItem
            key={item.id}
            bookmark={item}
          />
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
