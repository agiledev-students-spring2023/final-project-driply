import React, { useEffect, useState }  from 'react'
import { Link } from 'react-router-dom';

const TrendingCard = ({post}) => {
    const [img, setImg] = useState();

    useEffect(() => {
        async function fetchImage() {
            const response = await fetch(
            `http://localhost:4000/image`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "filename": post.image
                })
            });
            //let json = await response.json();
            if (response.status === 200) {
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setImg(imageObjectURL);
            }
        }

        fetchImage();
    }, [post.image]);

    const randomSize = Math.floor(Math.random() * 3);
    let picSize;
    if (randomSize === 0) { 
        picSize = "small"; 
    } 
    else if (randomSize === 1) { 
        picSize = "medium"; 
    } 
    else { 
        picSize = "large"; 
    }

    //lines 19 thru 31 is temp 
    //until backend is working
    let height;

    if (picSize === 'small'){
        height = 100;
    }

    else if (picSize === 'medium'){
        height = 125;
    }

    else {
        height = 150;
    }

  return (
    <div className={`galleryCard card ${picSize}`}>
        {/* <img src={post.post_picture}/> */}
        <Link to={`/post/${post._id}`}>
          <img className={`imgStyle trendingHeight${height}`} src={img} alt="postpic" />
        </Link>
    </div>
  )
}

export default TrendingCard