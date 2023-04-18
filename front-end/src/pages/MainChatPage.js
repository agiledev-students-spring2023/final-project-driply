import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { io } from "socket.io-client";
import moment from "moment";

function MainChatPage() {
  let navigate = useNavigate();

  const [chatsList, setChatLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { ifDarkMode } = useContext(DarkModeContext);
  const socket = useRef();

  async function fetchPfp(id) {
    const response = await fetch(`http://localhost:4000/getUserPfp`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "userId": id,
      })
    });

    if (response.status === 200) {
      const imageBlob = await response.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      return imageObjectURL;
    }
  }
  

  useEffect(() => {
    setLoading(true);
    const getUser = JSON.parse(localStorage.getItem("user"));
    socket.current = io(`http://localhost:4000?userId=${getUser.id}`);
    socket.current.on("chatHistory", async (data) => {
      for (let i = 0; i < data.chatList.length; i++) {
        const currentChat = data.chatList[i];
        for (let j = 0; j < currentChat.members.length; j++) {
          const url = await fetchPfp(data.chatList[i].members[j]._id);
          data.chatList[i].members[j].profilepic = url;
        }
      }
      // console.log(data.chatList);
      setChatLists(data.chatList);
      setLoading(false);
    });
  }, []);

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

    const [unseenMessages, setUnseenMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState("");
    const [formattedTime, setFormattedTime] = useState("");

    useEffect(() => {
      socket.current.on("updateChatHistory", (data) => {
        console.log('new message!');
        console.log(data.newMessage);
        if (data.newMessage.chatId === chat.chatId) {
          const id_from = data.newMessage.id_from;
          const message = data.newMessage.message;
          const newMsgObj = { id_from, message };
          setUnseenMessages((prev) => [...prev, newMsgObj]);
          setLastMessage(message);
        }
      });
    }, [chat.chatId]);

    const getUser = JSON.parse(localStorage.getItem("user"));
    let receiver = (getUser.username !== chat.members[0].name) ? chat.members[0] : chat.members[1];

    useEffect(() => {
      function displayChat() {
        if (chat.messages.length !== 0) {
          const copyMessages = [...chat.messages];
          copyMessages.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
          setLastMessage(copyMessages[copyMessages.length - 1].message);
          const createdAt = moment(copyMessages[copyMessages.length - 1].createdAt);
          const now = moment();
      
          // calculate the time difference in hours
          const hoursDiff = now.diff(createdAt, 'hours');
      
          // determine the format based on the time difference
          let format;
          if (hoursDiff < 24) {
            format = 'h:mm A'; // display the hour and minute
          } else if (hoursDiff < 6 * 24) {
            format = 'dddd'; // display the day of the week
          } else {
            format = 'M/D/YYYY'; // display the date
          }
          setFormattedTime(createdAt.format(format));
        }
      }

      displayChat();
    }, [chat]);

    return (
      <div onClick={() => {navigate(`/chatroom/${chat.chatId}`, {state: {name: chat?.first_name, senderImg: chat?.user_image}})}} className="eachChatDisplay">
        
        {/* image */}
        <div className="chatImg">
          <img src={receiver.profilepic} alt="username pic"/>
        </div>

        {/* chat details */}
        <div className="chatDetails">
          {/* Username and time message sent*/}
          <div className="topChatDetails">
            <h4>{receiver.name}</h4>

            {unseenMessages.length !== 0 ? (
                <p className="gray">{formattedTime}</p>
              ) : (
                <p>{formattedTime}</p>
              )
            }
            {/* <p className='gray'>{formattedTime}</p> */}
          </div>

          {/* last text and notifcations */}
          <div className="bottomChatDetails">
            {lastMessage.length < 24 ? (
              <p className={ifDarkMode ? "lastMessage-dark" : "lastMessage"}>Text: {lastMessage}</p>
            ) : (
              <p className={ifDarkMode ? "lastMessage-dark" : "lastMessage"}>Text: {lastMessage.substring(0, 24)}...</p>
            )}
            {unseenMessages.length === 0 ? (null) : (<p>{unseenMessages.length}</p>)}
          </div>

        </div>
      </div>
    );
  }


  function DisplayChats() {
    return (
      <>
        {/* {allChats?.slice(0).reverse().map((chat) => <Chat key={chat.id} chat={chat}/>)} */}
        {chatsList?.map((chat, idx) => <Chat key={idx} chat={chat}/>)}
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
      </div>

      {/* body */}
      <div className={`displayAllChats ${ifDarkMode && "darkTheme"}`}>

        {!user ? (
          <NotLoggedInDisplay />
        ) : (loading) ? (
          <LoadingChat />
        ) : (chatsList.length === 0) ? (
          <h3>No chats</h3>
        ) : (
          <DisplayChats />
        )}

      </div>
    </div>
  );
}


export default MainChatPage;


