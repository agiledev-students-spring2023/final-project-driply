import React from 'react'
import { Link } from 'react-router-dom';

const TrendingCard = ({post}) => {

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
        <Link to={`/post/0`}>
          <img className="imgStyle" src={`https://picsum.photos/100/${height}`} alt="postpic" />
        </Link>
    </div>
  )
}

export default TrendingCard