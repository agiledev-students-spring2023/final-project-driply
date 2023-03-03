import React, { useEffect, useState } from 'react';

function FollowingPage() {

    const [followingList, setFollowingList] = useState([]);
    const [followingError, setFollowingError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFollowingList() {
            const response = await fetch(`https://my.api.mockaroo.com/following_schema.json?key=${process.env.REACT_APP_MOCKAROO_API_KEY}`);
            let json = await response.json();
            if (response.status === 200) {
                setFollowingList(json);
                setFollowingError(null);
                setLoading(false);
                console.log(json);
            } else {
                setFollowingError(response.status);
                setLoading(false);
            }
        }

        fetchFollowingList();
    }, []);

    function LoadingFollowingList() {
        return (
            Array.from({length: 6}).map((_, idx) => {
                return (
                    <div key={idx} className="eachFollowingDisplay">
                        <div className="followingImg" style={{ backgroundColor: "#DDDDDD", borderRadius: "50%" }}></div>
                        <div className="followingDetails" style={{ backgroundColor: "#DDDDDD", borderRadius: "2%" }}></div>
                    </div>
                );
            })
        );
    }

    function Following({ following }) {
        return (
            <div className="eachFollowingDisplay">
                <div className="followingImg">
                    <img src={following.user_img} alt="user img"/>
                </div>
                <div className="followingDetails"></div>
            </div>
        );
    }

    function DisplayFollowingList() {
        return (
            <>
                {followingList.map((following) => <Following key={following.id} following={following}/>)}
            </>
        );
    }

    return (
        <div>

            {/* header */}
            <div className="chatPageHeader">
                <h1>Following</h1>
            </div>
            
            {loading ? (
                <LoadingFollowingList />
            ) : (
                <DisplayFollowingList />
            )}
            {followingError && <h1 className="error">Error: {followingError}</h1>}

        </div>
    )
}

export default FollowingPage;