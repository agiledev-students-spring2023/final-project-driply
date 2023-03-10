import React, { useState, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { DarkModeContext } from '../context/DarkModeContext';

function ChatRoomPage() {
    const navigate = useNavigate();
    // const { chatId } = useParams();
    const { ifDarkMode } = useContext(DarkModeContext);
    const location = useLocation();
    const firstName = location.state.name;
    const senderImg = location.state.senderImg;
    // console.log("chatId: ", chatId, firstName);

    const tempMessages = [
        {
            id: 1,
            from: "me",
            message: "Hello"
        },
        {
            id: 2,
            from: "person",
            message: "Hello"
        },
        {
            id: 3,
            from: "me",
            message: "How are you"
        },
        {
            id: 4,
            from: "person",
            message: "I'm good"
        },
        {
            id: 5,
            from: "person",
            message: "How are you?"
        },
        {
            id: 6,
            from: "me",
            message: "I'm good"
        },
    ]
    const [messages, setMessages] = useState(tempMessages);
    const inputRef = useRef();
    const onInput = () => inputRef.current.value;

    function SenderMessage({ message, idx }) {
        const animation = (idx === messages.length-1) ? "newMessage" : "";
        return (
            <div className={`senderMessage ${animation}`}>
                <div style={{ color: "white" }}>{message.message}</div>
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
                <h1>{firstName}</h1>
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
                    <input type="text" ref={inputRef} id="chatInput" placeholder="Type in here…" onInput={onInput}/>
                    <SendBtn className="submitChat" />
                </form>
            </div>

        </div>
    )
}

export default ChatRoomPage;