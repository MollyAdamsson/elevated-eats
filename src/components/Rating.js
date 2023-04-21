import React, { useState } from "react";

const Rating = (props) => {
    const {handleRate} = props;

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const getIconClassNames = (index, rating) => {
        if (index <= rating || index <= hover)
            return 'fas fa-star';

        return 'far fa-star';
    }

    const handleRatingClick = (index) => {
        setRating(index);
        console.log('Setting rating to', index)
        // API-anrop
        handleRate(index);
    }

    return <div className="rating">
        {[...Array(5)].map((_, index) => {
            index += 1;
            return <i
                className={getIconClassNames(index, rating)}
                key={index}
                onClick={() => handleRatingClick(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
            ></i>
        })}
    </div>
}

export default Rating;