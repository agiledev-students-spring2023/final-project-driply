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
            <div className="pfp"><img src="https://picsum.photos/id/64/200"/></div>
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
            <div className="posts"><img src="https://picsum.photos/id/22/130"/></div>
            <div className="posts"><img src="https://picsum.photos/id/27/130"/></div>
            <div className="posts"><img src="https://picsum.photos/id/24/130"/></div>
            <div className="posts"><img src="https://picsum.photos/id/25/130"/></div>
            
        </div>
    </div>
  )
}

export default ProfilePage