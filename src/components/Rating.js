import React, { useState, useEffect } from "react";

const Rating = (props) => {
    const { userRating, ratingsCount, totalStars, isOwner, handleRate } = props;

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        if (userRating)
            setRating(userRating);
    }, [userRating]);

    const getIconClassNames = (index, rating) => {
        if (index <= rating || index <= hover)
            return 'fas fa-star';

        return 'far fa-star';
    }

    const handleRatingClick = (index) => {
        if (!isOwner) {
            setRating(index);
            handleRate(index);
        }
    }

    const calculateAverageRating = () => {
        if (totalStars && ratingsCount) {
            return Math.round(((totalStars / ratingsCount) + Number.EPSILON) * 100) / 100;
        }
        return 0;
    }

    return <><div className="rating">
        {[...Array(5)].map((_, index) => {
            index += 1;
            if (isOwner) {
                return <React.Fragment key={index}></React.Fragment>;
            } else {
                return <i
                    className={getIconClassNames(index, rating)}
                    key={index}
                    onClick={() => handleRatingClick(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                ></i>
            }
        })}
    </div>
        <div>
            Average rating: {calculateAverageRating()} Number of ratings: {ratingsCount}
        </div>
    </>
}

export default Rating;