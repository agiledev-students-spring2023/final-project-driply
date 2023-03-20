import React, { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';

function Like() {
    const [likes, setLikes] = useState([]);
    const [likeChanged, setLikeChanged] = useState(false);
    const { user } = useAuthContext();

    useEffect(() => {
        setLikeChanged(false);
    }, [likeChanged]);

    const handleLike = () => {
        if (likes.filter(e => (e.localeCompare(user.username) === 0)).length === 0){
            likes.push(user.username);
        }
        else{
            const index = likes.indexOf(user.username);
            likes.splice(index, 1);
        }
        setLikeChanged(true);
    };
    
    return (
        <div className="right">
            {likes.length}
            {likes.filter(e => (e.localeCompare(user.username) === 0)).length === 0 && (
                <button
                    onClick={() => handleLike()}
                    className='btn btn-secondary mx-2'
                >
                    Like
                </button>
            )}
            {likes.filter(e => (e.localeCompare(user.username) === 0)).length > 0 && (
                <button
                    onClick={() => handleLike()}
                    className='btn btn-primary mx-2'
                >
                    Liked
                </button>
            )}
        </div>
    );
}

export default Like;