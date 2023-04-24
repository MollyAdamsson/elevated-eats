import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import PopularProfiles from "./PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { Button, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import ProfileReview from "../profilereviews/ProfileReview";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePosts, setProfilePosts] = useState({ results: [] });
  const [profileReviews, setProfileReviews] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const { id } = useParams();

  const [content, setContent] = useState('');

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();

  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState();

  const handleCloseModal = () => {
    setShowModal(false);
    setContent('');
  };
  const handleShowModal = () => setShowModal(true);
  const handleSubmit = async (event) => {
    const formData = new FormData();

    formData.append("profile", id);
    formData.append("content", content);

    try {
      const { data } = await axiosReq.post("/profilereviews/", formData);
      setProfileReviews(old => ({
        ...old,
        results: [
          ...old.results,
          data
        ]
      }))
      handleCloseModal();
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profilePosts }, { data: profileReviews }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/posts/?owner__profile=${id}`),
            axiosReq.get(`/profilereviews/?profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfilePosts(profilePosts);
        setProfileReviews(profileReviews)
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <div className="d-flex justify-content-around flex-row">
            <div className="my-2">
              <div>{profile?.posts_count}</div>
              <div>posts</div>
            </div>
            <div className="my-2">
              <div>{profile?.followers_count}</div>
              <div>followers</div>
            </div>
            <div className="my-2">
              <div>{profile?.following_count}</div>
              <div>following</div>
            </div>
            {!is_owner && <div
              className="btn btn-sm btn-dark my-4"
              onClick={handleShowModal}>Leave A Review</div>}
          </div>
        </Col>
        <Col lg={3} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            ))}
          {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
        </Col>
        {profile?.content && <Col className="p-3">{profile.content}</Col>}
      </Row>
    </>
  );

  const mainProfilePosts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s posts</p>
      <hr />
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => (
            <Post key={post.id} {...post} setPosts={setProfilePosts} />
          ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => fetchMoreData(profilePosts, setProfilePosts)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted yet.`}
        />
      )}
    </>
  );

  return (
    <>
      <Row>
        <Col className="py-2 p-0 p-lg-2" lg={{ span: 8, offset: 2 }}>
          <PopularProfiles mobile />
          <PopularProfiles />
          <Container className={appStyles.Content}>
            {hasLoaded ? (
              <>
                {mainProfile}
                {mainProfilePosts}
              </>
            ) : (
              <Asset spinner />
            )}
          </Container>
          <Container>
            <Row>
              {profileReviews.results.length ? (
                <InfiniteScroll
                  children={profileReviews.results.map((profileReview) => (
                    <ProfileReview
                      key={profileReview.id}
                      {...profileReview}
                      setProfile={setProfileData}
                      setProfileReviews={setProfileReviews}
                    />
                  ))}
                  dataLength={profileReviews.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!profileReviews.next}
                  next={() => fetchMoreData(profileReviews, setProfileReviews)}
                />
              ) : currentUser && !is_owner ? (
                <span>No reviews here, be the first one!</span>
              ) : (
                <span>No reviews yet!</span>
              )}
            </Row>
          </Container >
        </Col >
      </Row >
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Leave A Review!</Modal.Title>
        </Modal.Header>
        <Modal.Body><textarea
          className="w-100"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal></>
  );
}

export default ProfilePage;