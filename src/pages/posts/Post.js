import React, { useEffect } from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import Rating from "../../components/Rating";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    ingredients,
    instructions,
    ratings_count,
    total_stars,
    user_rating,
    rating_id,
    image,
    updated_at,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleRate = async (newRating, oldRating, increaseRatingsCount) => {
    const formData = new FormData();

    formData.append("post", id);
    formData.append("user_rating", newRating);

    if (user_rating) {
      try {
        const { data } = await axiosRes.put(`/ratings/${rating_id}/`, formData);
        setPosts((prevPosts) => ({
          ...prevPosts,
          results: prevPosts.results.map((post) => {
            const newTotalStars = post.total_stars - oldRating + newRating;
            const newRatingsCount = post.ratings_count + (increaseRatingsCount ? 1 : 0);
            return post.id === id
              ? { ...post, ratings_count: newRatingsCount, user_rating: data.user_rating, total_stars: newTotalStars }
              : post;
          }),
        }));
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const { data } = await axiosRes.post("/ratings/", formData);
        setPosts((prevPosts) => ({
          ...prevPosts,
          results: prevPosts.results.map((post) => {
            return post.id === id
              ? { ...post, ratings_count: post.ratings_count + 1, user_rating: data.user_rating, total_stars: post.total_stars + data.user_rating }
              : post;
          }),
        }));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center justify-content-between">
            <span>{updated_at}</span>
            {is_owner && postPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        <Link to={`/posts/${id}`}>
          <Card.Img src={image} alt={title} />
        </Link>
        {content && <Card.Text>{content}</Card.Text>}
        <div className="d-flex justify-content-around mb-3">
          <div>
            <h3>Ingredients</h3>
            <ul>
              {ingredients?.split(';').map((ingredient, index) => {
                return <li key={index} className="text-start">{ingredient}</li>;
              })}
            </ul></div>
          <div>
            <h3>Instructions</h3>
            <ol>
              {instructions?.split(';').map((instruction, index) => {
                return <li key={index} className="text-start">{instruction}</li>;
              })}
            </ol></div>
        </div>
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
        <div><Rating totalStars={total_stars}
          ratingsCount={ratings_count}
          userRating={user_rating}
          isOwner={is_owner}
          handleRate={handleRate} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;