import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { DarkModeContext } from "../context/DarkModeContext";
import Comment from "../components/Comment";


const PostPage = () => {
    //const { user } = useAuthContext();
    const { ifDarkMode } = useContext(DarkModeContext);
    const navigate = useNavigate();
    //const [comment, setComment] = useState("");
    //const [commentList, setCommentList] = useState([]);
    const [likes, setLikes] = useState([]);
    //const [likeChanged, setLikeChanged] = useState(false);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [postError, setPostError] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    const [fakeName, setFakeName] = useState(""); // remove after sprint 1, only used to randomize displayed username using mockaroo

    // this is just temp to get different imgs and sizes
    const randomProfileSize = [350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380];
    const randomProfileIndex = Math.floor(Math.random() * randomProfileSize.length);
    const randomPostSize = [350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380];
    const randomPostIndex = Math.floor(Math.random() * randomPostSize.length);

    useEffect(() => {
        //setLikeChanged(false);
        async function fetchPostInfo() {
            const response = await fetch(`http://localhost:4000/getPost`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
                // body: JSON.stringify({
                //     "postId": id
                // })
            });
            let json = await response.json();
            if (response.status === 200) {
                // Commented out fetching likes from mockaroo as clicking like would trigger the useEffect and refetch from mockaroo resulting in inaccurate like count and update.
                // setLikes(p.likes);
                setLikes([...json.likes]);
                setFakeName(json.username);
                setDescription(json.description);
                setPrice(json.price);
                setPostError(null);
                setLoading(false);
            } else {
                setPostError(response.status);
                setLoading(false);
            }
        }

        fetchPostInfo();
    }, []);


    return (
        <div className={`mb-100 postContainer overflow-auto ${ifDarkMode && "darkTheme"} postPage`}>
            <div className="row align-items-center mx-auto">
                <div className="col-8 d-flex align-items-center px-0 mx-auto">
                    <div onClick={() => navigate("/profile")} className="postpfp">
                        <img src={`https://picsum.photos/${randomProfileSize[randomProfileIndex]}/300`} alt="user img"/>
                    </div>
                    <span onClick={() => navigate("/profile")}>{fakeName}</span>
                </div>
                <div className="col-4 d-flex justify-content-end px-0 mx-auto">
                    <span className="mr-3">${price}</span>
                </div>
            </div>
            <img className="center-block img-responsive" src={`https://picsum.photos/${randomPostSize[randomPostIndex]}/300`} alt="pic"/>
            {description}
            <br/>
            <Comment postId={id} likes={likes}/>
        </div>
    );
};

export default PostPage;