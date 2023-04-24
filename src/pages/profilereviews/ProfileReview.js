import React, { useState } from "react";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import ProfileReviewEditForm from "./ProfileReviewEditForm";

import styles from "../../styles/Comment.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

const ProfileReview = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setProfile,
    setProfileReviews,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/profilereviews/${id}/`);
      setProfile((prevProfile) => {
        return ({
          ...prevProfile,
          pageProfile: {
            ...prevProfile.pageProfile,
            results: [
              {
                ...prevProfile.pageProfile.results[0],
                profilereviews_count: prevProfile.pageProfile.results[0].profilereviews_count - 1,
              },
            ]
          }
      })});

      setProfileReviews((prevProfileReviews) => ({
        ...prevProfileReviews,
        results: prevProfileReviews.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) { }
  };

  return (
    <>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          {showEditForm ? (
            <ProfileReviewEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_image}
              setComments={setProfileReviews}
              setProfileReviews={setProfileReviews}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </>
  );
};

export default ProfileReview;