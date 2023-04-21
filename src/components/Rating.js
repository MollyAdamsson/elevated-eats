import React from "react";

const [rating, setRating] = useState(0);
const [hover, setHover] = useState(0);

const getIconClassNames = (index, rating) => {
    if(index < rating)
        return 'far fa-star';

    return 'fas fa-star';
}

const handleRatingClick = (index) => {
    setRating(index + 1);
    // API-anrop
}

const Rating = () => {
    return <div className="rating">
        {[...Array(5)].map((star, index) => {
            return <i className={getIconClassNames(rating)} key={index} onClick={() => handleRatingClick(index)}></i>
        })}
    </div>
}

export default Rating;