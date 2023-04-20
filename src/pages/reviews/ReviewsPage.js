import React, { useEffect, useState } from 'react';
import Review from './Review';
import ReviewCreateForm from './ReviewCreateForm';
import axios from 'axios';

const ReviewsPage = ({ recipeId }) => {
  const [reviews, setReviews ] = useState([]);

  useEffect(() => {
    axios.get(`/reviews/?recipe_id=${recipeId}`)
            .then(response => {
                setReviews(response.data.reviews);
            })
            .catch(error => {
              console.error('Failed to fetch reviews', error);
            });
  }, [recipeId]);


  const handleReviewSubmit = (rating, comment) => {
   
    axios.post('/reviews/create/', { recipe_id: recipeId, rating, comment })
        .then(response => {
            
            setReviews([...reviews, response.data.review]);
        })
        .catch(error => {
            console.error('Failed to submit review:', error);
        });
}

  return (
    <div>
      <h1>Recipe Reviews</h1>
      <Review recipeId={recipeId} reviews={reviews} />
      <ReviewCreateForm onReviewSubmit={handleReviewSubmit} />
    </div>
  );
}

export default ReviewsPage