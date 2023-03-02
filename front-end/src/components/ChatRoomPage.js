import React from 'react';
import { useParams ,useLocation } from 'react-router-dom';

function ChatRoomPage() {

    const { chatId } = useParams();
    const location = useLocation();
    const firstName = location.state.name;
    console.log("chatId: ", chatId, firstName);

    return (
        <div>ChatRoomPage</div>
    )
}

export default ChatRoomPage;