import React from 'react';

// bookmark icon for when user does not have it bookmarked
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
// icon for when user bookmarked icon
// import BookmarkIcon from '@mui/icons-material/Bookmark'; <--- don't delete, will use later
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // unliked post
// import FavoriteIcon from '@mui/icons-material/Favorite'; // liked post
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

function Post({ post }) {
    return (
        <div className="post">

            {/* header */}
            <div className="postHeader">
                <div className="postHeaderDetails">
                    <img src={post.user_picture} alt="user img"/>
                    <p>{post.username}</p>
                </div>
                <p className="postCost">Total Cost: ${post.price}</p>

            </div>

            {/* width set 100%, height changes based on img */}
            {/* post pictures */}
            <div className="postBody">
                {/* <img src={post.post_picture} alt="post img"/> */}
                <img src="https://picsum.photos/300/300" alt="postpic"/>
                <div className="postBookmarkIcon">
                    <BookmarkBorderIcon sx={{ height: "50px", width: "50px" }} />
                </div>
                {/* post likes, comments */}
                <div className="postDetails">
                    <div>
                        <FavoriteBorderIcon />
                        <p>{post.likes}</p>
                    </div>
                    <div>
                        <ChatBubbleIcon />
                        <p>{post.comments}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Post