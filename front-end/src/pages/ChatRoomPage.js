import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { DarkModeContext } from '../context/DarkModeContext';

function ChatRoomPage() {
    const navigate = useNavigate();
    const { ifDarkMode } = useContext(DarkModeContext);
    const senderImg = "https://picsum.photos/100/100";
    const params = useParams();
    const { chatId } = params;
    const [id1, id2] = chatId.split("--");
    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState("");

    useEffect(() => {

        async function fetchProfileInfo() {
            const response1 = await fetch(`http://localhost:4000/profile`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userId": id1
                })
            });
            const response2 = await fetch(`http://localhost:4000/profile`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userId": id2
                })
            });
            let json = await response1.json();
            let json2 = await response2.json();
            console.log(json);
            const getUser = JSON.parse(localStorage.getItem("user"));
            if (json.success && json2.success) {
                if (json.data.id === getUser.id) {
                    console.log(json.data.id === getUser.id, json.data.id, getUser.id);
                    setSender(json.data);
                    setReceiver(json2.data);
                } else if (json2.data.id === getUser.id) {
                    console.log(json2.data.id === getUser.id, json2.data.id, getUser.id);
                    setSender(json2.data);
                    setReceiver(json.data);
                }
            } else {
                console.log(json.message);
            }
        }
        fetchProfileInfo();

    }, [id1, id2]);

    const [messages, setMessages] = useState([]);
    const inputRef = useRef();
    const onInput = () => inputRef.current.value;

    function SenderMessage({ message, idx }) {
        const animation = (idx === messages.length-1) ? "newMessage" : "";
        return (
            <div className={`senderMessage ${animation}`}>
                <div className="white">{message.message}</div>
            </div>
        );
    }

    function ReceiverMessage({ message, idx }) {
        return (
            <div className="receiverMessageBubble">
                <img className="receiverImg" src={senderImg} width="40px" height="40px" alt="img"/>
                <div className="receiverMessage">{message.message}</div>
            </div>
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const typedMessage = inputRef.current.value;
        if (typedMessage.length === 0) {
            console.log("empty message");
            return;
        }
        const messageObj = {id: messages.length+1, from: "me", message: typedMessage};
        const copiedMessages = [...messages];
        copiedMessages.push(messageObj);
        setMessages(copiedMessages);
        inputRef.current.value = "";
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    }

    function SendBtn() {
        return (
            <div className="sendChatBtnDiv">
                <div onClick={event => handleSubmit(event)} className='sendChatBtn'>
                    <SendIcon />
                </div>
            </div>
        );
    }

    return (
        <div className={`${ifDarkMode ? "chatRoomPage-dark" : "chatRoomPage"}`}>

            {/* header */}
            <div className={`chatRoomHeader ${ifDarkMode && "darkTheme"}`}>
                <div onClick={() => {navigate(`/chats`)}}><ArrowBackIcon size="lg" /></div>
                <h1>{receiver?.name}</h1>
            </div>

            {/* body - display messages */}
            <div className="displayMessages">
                {messages.map((message, idx) => {
                    if (message.from === "me") {
                        return (
                            <SenderMessage key={message.id} message={message} idx={idx}/>
                        )
                    } else  {
                        return (
                            <ReceiverMessage key={message.id} message={message} idx={idx}/>
                        )
                    }
                })}
            </div>
            <div className="chatroomInput">
                <form>
                    <input onKeyDown={event => handleKeyDown(event)} type="text" ref={inputRef} id="chatInput" placeholder="Type in here…" onInput={onInput}/>
                    <SendBtn className="submitChat" />
                </form>
            </div>

        </div>
    )
}

export default ChatRoomPage;