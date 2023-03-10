import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuthContext } from '../hooks/useAuthContext';

function MainChatPage() {
  let navigate = useNavigate();

  const [allChats, setAllChats] = useState([]);
  const [chatError, setChatError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const { ifDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    async function fetchUsersChat () {
      if (user) {
        const response = await fetch(`https://my.api.mockaroo.com/users_chats.json?key=${process.env.REACT_APP_MOCKAROO_API_KEY}`);
        let json = await response.json();
        if (response.status === 200) {
          json.sort((a, b) => new Date(a.date_sent) - new Date(b.date_sent)); // sorted based on date
          setAllChats(json);
          setChatError(null);
          setLoading(false);
        } else {
          setLoading(false);
          setChatError({error: json.error, status: response.status});
        }
      }
    }
    fetchUsersChat();
  }, [user]);

  function LoadingChat() {
    return (
      Array.from({length: 6}).map((_, idx) => {
        return (
          <div key={idx} className="eachChatDisplay">
            <div className="chatImg chatImgLoading"></div>
            <div className="chatDetails chatDetailsLoading"></div>
          </div>
        );
      })
    );
  }

  function Chat({ chat }) {
    const ifRead = chat.read;
    const today = new Date();
    const todayFormat = new Date(today.getMonth() + 1  + "/" + today.getDate() + "/" + today.getFullYear());
    const givenDate = new Date(chat.date_sent);
    const diff = todayFormat.getTime() - givenDate.getTime();
    const countedDays = diff / (1000 * 3600 * 24);
    const daySent = new Date(today);
    daySent.setDate(daySent.getDate() - countedDays);
    const getDay = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
    let dateDisplay;
    if (countedDays <= 6 && countedDays >= 1) {
      dateDisplay = getDay[daySent.getDay()];
    } else if (countedDays === 0) {
      dateDisplay = chat.time_sent;
    } else {
      dateDisplay = `${daySent.getMonth() + 1}/${daySent.getDate()}/${daySent.getFullYear()}`;
    }

    return (
      <div onClick={() => {navigate(`/chatroom/${chat.id}`, {state: {name: chat.first_name, senderImg: chat.user_image}})}} className="eachChatDisplay">
        
        {/* image */}
        <div className="chatImg">
          <img src={chat.user_image} alt="username pic"/>
        </div>

        {/* chat details */}
        <div className="chatDetails">
          {/* Username and time message sent*/}
          <div className="topChatDetails">
            <h4>{chat.first_name}</h4>

            {ifRead ? (
                <p style={{ color: "gray" }}>{dateDisplay}</p>
              ) : (
                <p>{dateDisplay}</p>
              )
            }
          </div>

          {/* last text and notifcations */}
          <div className="bottomChatDetails">
            {chat.last_text.length < 30 ? (
              <p>{chat.last_text}</p>
            ) : (
              <p>{chat.last_text.substring(0, 30)}...</p>
            )}
            {ifRead ? (null) : (<p>{chat.notifications}</p>)}
          </div>

        </div>
      </div>
    )
  }

  function DisplayChats() {
    return (
      <>
        {allChats?.slice(0).reverse().map((chat) => <Chat key={chat.id} chat={chat}/>)}
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
    <div className={`chatPage ${ifDarkMode && "darkTheme"}`}>
      {/* header */}
      <div className={`chatPageHeader ${ifDarkMode && "darkTheme"}`}>
        <h1>Messages</h1>
        {user && <>
          <p>New</p>
          <p>Edit</p>
        </>}
      </div>

      {/* body */}
      <div className={`displayAllChats ${ifDarkMode && "darkTheme"}`}>

        {!user ? (
          <NotLoggedInDisplay />
        ) : (loading) ? (
          <LoadingChat />
        ) : (allChats.length === 0 && !chatError) ? (
          <h3>No chats</h3>
        ) : (
          <DisplayChats />
        )}


        {chatError && user && <div>
          <h1 className="error">Error Code: {chatError.status}</h1>
          <h3 className="error">{chatError.error}</h3>
        </div>}
      </div>
    </div>
  )
}

export default MainChatPage;