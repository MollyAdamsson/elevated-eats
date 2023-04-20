import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Review = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('/reviews/?recipe_id=${recipeId}')
    .then(response => {
      setReviews(response.data.reviews);
    })
    .catch(error => {
      console.log('Failed to fetch reviews:', error);
    });
  }, [recipeId]);

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length === 0 ? (
                <p>No reviews available for this recipe.</p>
            ) : (
                reviews.map(review => (
                    <div key={review.id}>
                        <p>Rating: {review.rating}</p>
                        <p>Comment: {review.comment}</p>
                        {}
                    </div>
                ))
            )}
        </div>
    );
}

export default Review