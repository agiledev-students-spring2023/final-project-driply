import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
//import { Link } from 'react-router-dom';

// const required = (value) => {
//     if (!value){
//         return (
//             <div className="alert alert-danger" role="alert">
//                 This field is required!
//             </div>
//         );
//     }
// };

const PostPage = () => {
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [post, setPost] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [postError, setPostError] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPostInfo() {
            const response = await fetch(``, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "PostId": id
                })
            });
            let json = await response.json();
            if (response.status === 200) {
                console.log(json);
                setPostError(null);
                setLoading(false);
            } else {
                setPostError(response.status);
                setLoading(false);
            }
        }

        fetchPostInfo();
    }, []);

    const onChangeComment = (e) => {
        setComment(e.target.value);
    };

    const handleComment = (e) => {
        e.preventDefault();


    };

    return (
        <div>
            <div className="row align-items-center" style={{margin: 'auto'}}>
                <div className="col-8 d-flex align-items-center ps-0 ">
                    <div onClick={() => navigate("/profile")} className="followingImg">
                        <img src="https://picsum.photos/id/64/200" alt="user img"/>
                    </div>
                    <span onClick={() => navigate("/profile")}>Username</span>
                </div>
                <div className="col-4 d-flex justify-content-end">
                    <span className="mr-3">Cost</span>
                </div>
            </div>
            <img className="center-block img-responsive" src="https://picsum.photos/id/24/131/150" alt="pic"/>
        </div>
    );
};

export default PostPage;