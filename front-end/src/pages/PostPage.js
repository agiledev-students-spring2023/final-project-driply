import React, { useEffect } from "react";
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
    //const [comment, setComment] = useState("");
    //const [post, setPost] = useState(null);

    useEffect(() => {
        // Retrieve post information here and update post using setPost
    }, []);

    // const onChangeComment = (e) => {
    //     setComment(e.target.value);
    // };

    // const handleComment = (e) => {
    //     e.preventDefault();


    // };

    return (
        <div>
            <div className="container">
                <img className="center-block img-responsive" src="https://picsum.photos/id/24/131/150" alt="pic"/>
            </div>
        </div>
    );
};

export default PostPage;