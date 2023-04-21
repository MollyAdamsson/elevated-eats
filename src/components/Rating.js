import React from "react";

const [rating, setRating] = useState(0);
const [hover, setHover] = useState(0);

const getIconClassNames = (index, rating) => {
    if (hover)
        return 

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
        {[...Array(5)].map((_, index) => {
            return <i 
            className={getIconClassNames(index, rating)} 
            key={index} 
            onClick={() => handleRatingClick(index +1)}
            onMouseEnter={() => setHover(index + 1)}
            onMouseLeave={() => setHover(0)}
            ></i>
        })}
    </div>
}

export default Rating;