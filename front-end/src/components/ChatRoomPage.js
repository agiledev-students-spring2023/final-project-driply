import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Input from "@mui/joy/Input";
import { Button } from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function ChatRoomPage() {
    const navigate = useNavigate();
    const { chatId } = useParams();
    const location = useLocation();
    const firstName = location.state.name;
    const senderImg = location.state.senderImg;
    console.log(senderImg);
    console.log("chatId: ", chatId, firstName);

    const messages = [
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


    function SenderMessage({ message }) {
        return (
            <div className="senderMessage">
                <div style={{ color: "white" }}>{message.message}</div>
            </div>
        );
    }

    function ReceiverMessage({ message }) {
        return (
            <div style={{ display: "flex", flexDirection: "row", paddingTop: "2px" }}>
                <img className="receiverImg" src={senderImg} width="50px" alt="img"/>
                <div className="receiverMessage">{message.message}</div>
            </div>
        );
    }

    return (
        <div className="chatRoomPage">

            {/* header */}
            <div className="chatRoomHeader">
                <div onClick={() => {navigate(`/chats`)}}><ArrowBackIcon size="lg" /></div>
                {/* <h3 onClick={() => {navigate(`/chats`)}}>{backArr}</h3> */}
                <h1>{firstName}</h1>
            </div>

            {/* body - display messages */}
            <div className="displayMessages">
                {messages.map((message) => {
                    if (message.from === "me") {
                        return (
                            <ReceiverMessage key={message.id} message={message}/>
                        )
                    } else  {
                        return (
                            <SenderMessage key={message.id} message={message}/>   
                        )
                    }
                })}
            </div>
            <div className="chatroomInput">
                <Input placeholder="Type in here…" size="lg" variant="outlined" endDecorator={<Button variant="contained" endIcon={<SendIcon />}>Send</Button>}/>
            </div>

        </div>
    )
}

export default ChatRoomPage;