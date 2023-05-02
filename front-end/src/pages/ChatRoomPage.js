import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { DarkModeContext } from "../context/DarkModeContext";
import { io } from "socket.io-client";
import { useAuthContext } from "../hooks/useAuthContext";
import moment from "moment";

function ChatRoomPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { ifDarkMode } = useContext(DarkModeContext);
  const params = useParams();
  const { chatId } = params;
  const [id1, id2] = chatId.split("--");
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();
  const socket = useRef();
  const chatListRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    socket.current = io(`http://localhost:4000?chatId=${chatId}`);
    socket.current.on("createdRoom", (data) => {
      const copyMessages = data.messages;
      copyMessages.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setMessages(copyMessages);
      setIsLoading(false);
    });
  }, [chatId]);
  useEffect(() => {
    socket.current.on(`sendMessage-${chatId}`, (data) => {
      const copyMessages = data.messages;
      copyMessages.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setMessages(copyMessages);
    });
  });

  useEffect(() => {
    if (messages.length !== 0) {
      chatListRef.current.scrollIntoView(); // to show the user the last text message always without having to scroll
    }
  }, [messages]);
  useEffect(() => {
    async function fetchProfileInfo() {
      localStorage.removeItem(`chatRoomId-${chatId}`);
      const response1 = await fetch(`http://localhost:4000/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id1,
        }),
      });
      const response2 = await fetch(`http://localhost:4000/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id2,
        }),
      });
      let json = await response1.json();
      let json2 = await response2.json();
      const getUser = JSON.parse(localStorage.getItem("user"));
      if (json.success && json2.success) {
        if (json.data.id === getUser.id) {
          const url1 = await fetchPfp(json.data.id);
          const url2 = await fetchPfp(json2.data.id);
          json.data["profilepic"] = url1;
          json2.data["profilepic"] = url2;
          setSender(json.data);
          setReceiver(json2.data);
        } else if (json2.data.id === getUser.id) {
          const url1 = await fetchPfp(json2.data.id);
          const url2 = await fetchPfp(json.data.id);
          json2.data["profilepic"] = url1;
          json.data["profilepic"] = url2;
          setSender(json2.data);
          setReceiver(json.data);
        }
      } else {
        console.log(json.message);
      }
    }
    fetchProfileInfo();
  }, [id1, id2, chatId]);

  async function fetchPfp(id) {
    const response = await fetch(`http://localhost:4000/getUserPfp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
      }),
    });

    if (response.status === 200) {
      const imageBlob = await response.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      return imageObjectURL;
    }
  }

  const onInput = () => inputRef.current.value;

  function SenderMessage({ message, idx }) {
    const createdAt = moment(message.createdAt);
    const format = "h:mm A";
    const formattedTime = createdAt.format(format);
    const animation = idx === messages.length - 1 ? "newMessage" : "no-animate";
    return (
      <div className={`senderMessage ${animation}`}>
        <div className="white">{message.message}</div>
        <p style={{ fontSize: "10px" }}>{formattedTime}</p>
      </div>
    );
  }

  function ReceiverMessage({ message, idx }) {
    const createdAt = moment(message.createdAt);
    const format = "h:mm A";
    const formattedTime = createdAt.format(format);
    const animation = idx === messages.length - 1 ? "newMessage" : "no-animate";
    return (
      <div className={`receiverMessageBubble ${animation}`}>
        <img
          className="receiverImg"
          src={receiver?.profilepic}
          width="40px"
          height="40px"
          alt="img"
        />
        <div
          className={ifDarkMode ? "receiverMessage-dark" : "receiverMessage"}
        >
          {message.message}
          <p style={{ fontSize: "10px" }}>{formattedTime}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const chatPartnerId = user.id === id1 ? id2 : id1;
    const typedMessage = inputRef.current.value;
    if (typedMessage.length === 0) {
      console.log("empty message");
      return;
    }

    socket.current.emit("sendMessage", {
      id_from: user.id,
      message: typedMessage,
      chatRoomId: chatId,
      members: [user.id, chatPartnerId],
    });

    inputRef.current.value = "";
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  function SendBtn() {
    return (
      <div className="sendChatBtnDiv">
        <div
          onClick={(event) => handleSubmit(event)}
          className="sendChatBtn"
        >
          <SendIcon />
        </div>
      </div>
    );
  }

  return (
    <div className={`${ifDarkMode ? "chatRoomPage-dark" : "chatRoomPage"}`}>
      {/* header */}
      <div className={`chatRoomHeader ${ifDarkMode && "darkTheme"}`}>
        <div
          onClick={() => {
            navigate(`/chats`);
          }}
        >
          <ArrowBackIcon size="lg" />
        </div>
        <h1>{receiver?.name}</h1>
      </div>

      {/* body - display messages */}
      <div className="displayMessages">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          messages.map((message, idx) => {
            if (message.id_from === sender.id) {
              return (
                <SenderMessage
                  key={idx}
                  message={message}
                  idx={idx}
                />
              );
            } else {
              return (
                <ReceiverMessage
                  key={idx}
                  message={message}
                  idx={idx}
                />
              );
            }
          })
        )}
        <div ref={chatListRef} />
      </div>
      <div
        className={
          ifDarkMode ? "chatroomInput chatroomInput-dark" : "chatroomInput"
        }
      >
        <form>
          <input
            onKeyDown={(event) => handleKeyDown(event)}
            type="text"
            ref={inputRef}
            className={ifDarkMode ? "chatInput chatInput-dark" : "chatInput"}
            placeholder="Type in here…"
            onInput={onInput}
          />
          <SendBtn className="submitChat" />
        </form>
      </div>
    </div>
  );
}

export default ChatRoomPage;
