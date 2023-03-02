import React, { useEffect, useState } from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';

function Bookmarks() {

  const [bookmarkList, setBookmarkList] = useState([]);
  const [bookmarkError, setBookmarkError] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = false;

  useEffect(() => {
    async function fetchBookmarkList() {
      const response = await fetch("https://my.api.mockaroo.com/bookmark_schema.json?key=90e03700");
      let json = await response.json();
      if (response.status === 200) {
        setBookmarkList(json);
        setBookmarkError(null);
        setLoading(false);
      } else {
        setBookmarkError(response.status);
        setLoading(false);
      }
    }

    fetchBookmarkList();
  }, []);


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
    )
  }

  return (
    <div className="bookmarkPage">

      {/* header */}
      <div className="bookmarkPageHeader">
        <h1>Bookmarks</h1>
      </div>

      {/* body */}
      <div className="displayAllBookmarks">
        {loading ? (
          <LoadingBookmarkList />
        ) : (bookmarkList.length === 0) ? (
          <div>
            <h3>You have no bookmarks</h3>
          </div>
        ) : (
          <DisplayBookmarkList />
        )}
        {bookmarkError && <div className="error">{bookmarkError}</div>}
      </div>


    </div>
  )
}

export default Bookmarks