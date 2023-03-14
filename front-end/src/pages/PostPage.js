import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { DarkModeContext } from "../context/DarkModeContext";


const PostPage = () => {
    const { ifDarkMode } = useContext(DarkModeContext);
    const navigate = useNavigate();
    const form = useRef();
    const [comment, setComment] = useState("");
    const [post, setPost] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [likes, setLikes] = useState([]);
    const [likeChanged, setLikeChanged] = useState(false);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [postError, setPostError] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();

    useEffect(() => {
        setLikeChanged(false);
        async function fetchPostInfo() {
            const response = await fetch(`https://my.api.mockaroo.com/post.json?key=997e9440`, {
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
                console.log(json);
                const p = json[0];
                setCommentList(p.comments);
                setLikes(p.likes);
                setDescription(p.description);
                setPrice(p.price);
                setPostError(null);
                setLoading(false);
            } else {
                setPostError(response.status);
                setLoading(false);
            }
        }

        fetchPostInfo();
    }, [likeChanged]);

    const onChangeComment = (e) => {
        setComment(e.target.value);
    };

    const handleComment = (e) => {
        e.preventDefault();
        async function addComment() {
            const response = await fetch(`url`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "postId": id,
                    "comment": comment
                })
            });
            let json = await response.json();
            if (response.status === 200) {
                console.log(json);
            } else {
                setPostError(response.status);
                setLoading(false);
            }
        }

        addComment();
        setCommentList([comment, ...commentList]);
        setComment('');
        console.log(commentList);
    };

    const handleLike = () => {
        if (likes.filter(e => (e.localeCompare(user.username) === 0)).length === 0){
            likes.push(user.username);
        }
        else{
            const index = likes.indexOf(user.username);
            likes.splice(index, 1);
        }
        setLikeChanged(true);
        console.log(likes);
    };

    return (
        <div className={`mb-10 ${ifDarkMode && "darkTheme"}`}>
            <div className="row align-items-center mx-auto">
                <div className="col-8 d-flex align-items-center px-0 mx-auto">
                    <div onClick={() => navigate("/profile")} className="postpfp">
                        <img src="https://picsum.photos/id/64/200" alt="user img"/>
                    </div>
                    <span onClick={() => navigate("/profile")}>Username</span>
                </div>
                <div className="col-4 d-flex justify-content-end px-0 mx-auto">
                    <span className="mr-3">{price}</span>
                </div>
            </div>
            <img className="center-block img-responsive" src="https://picsum.photos/id/24/131/150" alt="pic"/>
            {description}
            <br/>
            <div style={{ textAlign: "right" }}>
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
            <div class="container">
                <Form onSubmit={handleComment} ref={form} class="row align-items-center">
                    <div className="col-auto px-0">
                    <div onClick={() => navigate("/profile")} className="postpfp">
                        <img src="https://picsum.photos/id/64/200" alt="user img"/>
                    </div>    
                    </div>
                    <div class="col px-0">
                        <Input
                            type="text"
                            value={comment}
                            className="form-control search-query"
                            name="comment"
                            onChange={onChangeComment}
                            required
                        />
                    </div>
                    <div class="col-auto">
                    <button className="btn btn-success btn-block">Submit</button>
                    </div>
                </Form>
            </div>
            {commentList.map(c => (
                <div className="row align-items-center mx-auto">
                <div className="col-12 d-flex align-items-center px-0 mx-0">
                    <div onClick={() => navigate("/profile")}>
                        <img src="https://picsum.photos/id/64/200" alt="user img" className="postpfp"/>
                    </div>
                    <div className="d-flex flex-column align-items-left mx-2">
                        <span className="username">Username</span>
                        <span>{c}</span>
                    </div>
                </div>
            </div>
            ))}
            <div className="pb-5">hello</div>
        </div>
    );
};

export default PostPage;