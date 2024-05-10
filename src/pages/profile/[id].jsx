// React imports
import React, { useEffect, useState } from "react";

// Next.js imports
import { useNavigate } from "react-router-dom";

// Redux imports
import { useDispatch } from "react-redux";
import { getProfileById } from "../axios/axios";

// Material-UI imports

// Custom component imports
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";

// Icons imports
import ProfileHeader from "../../components/profile/ProfileHeader";
import LeftSideBar from "../../components/profile/LeftSideBar";
import MainContent from "../../components/profile/MainContent";
import Experiences from "../../components/profile/Experiences";
import ProtectedRoute from "../../components/layouts/ProtectedRoute";
import NotFound from "../404";

export default function Profile() {
  // Next.js router
  const navigate = useNavigate();

  const { id } = router.query;

  // Redux state and dispatch
  const dispatch = useDispatch();

  // Component state
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getProfileById(id));
        setProfileData(response.payload.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, id]);

  // Update document title with profile name
  useEffect(() => {
    if (profileData?.user?.first_name && profileData?.user?.lastName) {
      document.title = `${profileData.user.first_name} ${profileData.user.lastName} | Profile`;
    }
  }, [profileData]);
  return (
    <ProtectedRoute>
      <Navbar />
      {isLoading ? (
        <div className="border rounded-3xl max-w-screen-xl flex items-center justify-center h-[80vh] mt-28 mb-14 mx-auto">
          <div className="loader"></div>
        </div>
      ) : !profileData ? (
        <NotFound />
      ) : (
        <>
          <div className="border rounded-3xl max-w-screen-xl mt-28 mx-2 lg:mx-auto">
            <ProfileHeader
              isMine={false}
              userProfile={profileData}
              isLoading={isLoading}
            />
            <div className="lg:grid grid-cols-3">
              {" "}
              <LeftSideBar isMine={false} userProfile={profileData} />
              <MainContent isMine={false} userProfile={profileData} />
            </div>
          </div>
          <Experiences isMine={false} userProfile={profileData} />
        </>
      )}

      <Footer />
    </ProtectedRoute>
  );
}
