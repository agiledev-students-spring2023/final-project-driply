import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MainChatPage() {
  let navigate = useNavigate();

  const [allChats, setAllChats] = useState([]);
  const [chatError, setChatError] = useState(null);

  useEffect(() => {
    async function fetchUsersChat () {
      const response = await fetch("https://my.api.mockaroo.com/users_chats.json?key=90e03700");
      let json = await response.json();
      if (response.status === 200) {
        json.sort((a, b) => new Date(a.date_sent) - new Date(b.date_sent)); // sorted based on date
        setAllChats(json);
        setChatError(null);
      } else {
        // console.log(response);
        setChatError(response.status);
      }
    }
    fetchUsersChat();
  }, []);

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

  return (
    <div className="chatPage">
      {/* header */}
      <div className="chatPageHeader">
        <h1>Messages</h1>
        <p>New</p>
        <p>Edit</p>
      </div>

      {/* body */}
      <div className="displayAllChats">
        {allChats?.slice(0).reverse().map((chat) => <Chat key={chat.id} chat={chat}/>)}
        {chatError && <h1 className="error">Error: {chatError}</h1>}
      </div>
    </div>
  )
}

export default MainChatPage;