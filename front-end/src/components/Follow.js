import React, { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';

function Follow(props) {
    const [followed, setFollowed] = useState(false);
    const [followedChanged, setFollowedChanged] = useState(false);
    const [ownProfile, setOwnProfile] = useState(props.ownProfile);
    const { user } = useAuthContext();

    useEffect(() => {
        setFollowedChanged(false);
    }, [followedChanged]);

    const handleFollow = () => {
        setFollowed(!followed);
        setFollowedChanged(true);
    };

    function FollowButton() {
        if (!followed){
          return (
            <button
              onClick={() => handleFollow()}
              className='btn btn-secondary'
            >
                Follow
            </button>
          )
        }
        else{
          return (
            <button
                onClick={() => handleFollow()}
                className='btn btn-primary'
            >
                Followed
            </button>
          )
        }
    }
    
    return (
      <>
      { ownProfile ?
        (
          <div></div>
        ) : (
          <div className="right">{user ? <FollowButton /> : <div></div>}</div>
        )
      }
      </>
    )
}

export default Follow;