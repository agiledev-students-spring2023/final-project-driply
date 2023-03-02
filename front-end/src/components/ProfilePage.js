import React from 'react'

function ProfilePage() {
    const user = true

    function FollowButton() {
        return (
            <div className="followButton">
                Follow
            </div>
        )
    }
  return (
    <div className="profileContainer">
        <div className="pfpContainer">
            <div className="pfp">ProfilePic</div>
            {user ? <FollowButton/> : <div></div>}
        </div>

        <div className="profileInfo">
            <div className="profileInfoSpecific">
                <p>3</p>
                <p>Posts</p>
            </div>
            <div className="profileInfoSpecific">
                <p>3</p>
                <p>Followers</p>
            </div>
            <div className="profileInfoSpecific">
                <p>3</p>
                <p>Following</p>
            </div>
        </div>

        <div className="postsContainer">
            <div className="posts">post 1</div>
            <div className="posts">post 2</div>
            <div className="posts">post 3</div>
            <div className="posts">post 4</div>
        </div>
    </div>
  )
}

export default ProfilePage