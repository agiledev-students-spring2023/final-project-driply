import React, { useContext, useEffect, useState } from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useAuthContext } from '../hooks/useAuthContext';
import { DarkModeContext } from '../context/DarkModeContext';

function Bookmarks() {

  const { ifDarkMode } = useContext(DarkModeContext);
  const [bookmarkList, setBookmarkList] = useState([]);
  const [bookmarkError, setBookmarkError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchBookmarkList() {
      if (user) {
        const response = await fetch(`https://my.api.mockaroo.com/bookmark_schema.json?key=${process.env.REACT_APP_MOCKAROO_API_KEY}`);
        let json = await response.json();
        if (response.status === 200) {
          setBookmarkList(json);
          setBookmarkError(null);
          setLoading(false);
        } else {
          setBookmarkError({error: json.error, status: response.status});
          setLoading(false);
        }
      }
    }

    fetchBookmarkList();
  }, [user]);


  function LoadingBookmarkList() {
    return (
      Array.from({length: 4}).map((_, idx) => {
        return (
          <div key={idx} className="bookmarkItem" style={{ backgroundColor: "#DDDDDD", borderRadius: "2%" }}></div>
        );
      })
    );
  }

  function BookmarkItem({ bookmark }) {
    return (
      <div className="bookmarkItem">
        <div className="bookmarkIcon">
          <BookmarkIcon sx={{ height: "40px", width: "40px" }} />
        </div>
        <div className="bookmarkImg">
          <img src={bookmark.image} alt="bookmark img"/>
        </div>
        <div className="bookmarkTitle">{bookmark.title}</div>
      </div>
    );
  }

  function DisplayBookmarkList() {
    return (
      <>
        {bookmarkList.map((item) => <BookmarkItem key={item.id} bookmark={item}/>)}
      </>
    );
  }

  function NotLoggedInDisplay() {
    return (
      <div className="notLoggedInBookmark">
        <h2>You are not logged in</h2>

        <div className="displayLogInBtn">
          Login
        </div>
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
        ) : (loading) ? (
          <LoadingBookmarkList />
        ) : (bookmarkList.length === 0 && !bookmarkError) ? (
          <h3>No bookmarks</h3>
        ) : (
          <DisplayBookmarkList />
        )}
        {bookmarkError && user && <div>
          <h1 className="error">Error Code: {bookmarkError.status}</h1>
          <h3 className="error">{bookmarkError.error}</h3>
        </div>}
      </div>


    </div>
  )
}

export default Bookmarks;