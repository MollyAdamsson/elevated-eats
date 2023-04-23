import React from "react";
import { Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();

  return (
    <Container
      className={`text-center mb-3 ${mobile && "d-lg-none"} ${!mobile && "d-none d-lg-block"}`}
    >
      {popularProfiles.results.length ? (
        <>
          <h3>Most followed creators</h3>
          <div>
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, mobile ? 4 : popularProfiles.results.length).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile={mobile} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;