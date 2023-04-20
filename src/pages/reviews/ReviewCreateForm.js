import React, { useState } from 'react';
import axios from 'axios';

const ReviewCreateForm = ({ recipeId }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/reviews/create/', { recipe_id: recipeId, rating, comment })
    .then(response => {
      setSuccess(true);
      setError('');
    })
    .catch(error => {
      setSuccess(false);
      setError('Failed to submit review, please try again!')
    });
  }

  return (
    <div>
      <h2>Submit Review</h2>
      {success && <p>The review was successfully submitted</p>}
      {error && <p>Could not submit review</p>}
      <form onSubmit={handleSubmit}>
          <label>Rating:</label>
          <select 
          id="rating" 
          name="rating"
          value={rating} 
          onChange={handleRatingChange}>
            <option value="">Select rating</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <label>Comment</label>
                <textarea 
                id="comment" 
                name="comment" 
                value={comment} 
                onChange={handleCommentChange}></textarea>
                <button type="submit">Submmit</button>
      </form>
    </div>
  );
}

export default ReviewCreateForm