import React, { useEffect, useState } from "react";
import Footer from "../../components/layouts/Footer";
import Navbar from "../../components/layouts/Navbar";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptJob,
  getClients,
  getHires,
  requestCompletion,
} from "../../axios/axios";
import { MdOutlineLocationOn } from "react-icons/md";
import { Rating, StickerStar } from "@smastrom/react-rating";
import { VscUnverified } from "react-icons/vsc";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Description from "../../components/ui/Description";
import { formatDistance } from "date-fns";
import ProtectedRoute from "../../components/layouts/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import RatingsModal from "../../components/modals/RatingsModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const MyFreelancers = () => {
  const [data, setData] = useState([]);
  const loading = useSelector((state) => state.loading.loading);
  const userProfile = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState([]);
  const [showRatingsModal, setShowRatingsModal] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(null);
  const [showInvitationModal, setShowInvitationModal] = useState(null);
  const handleCheckboxChange = (status) => {
    // Check if status already exists in active array
    const index = active.indexOf(status);
    if (index === -1) {
      // If not, add it
      setActive([...active, status]);
    } else {
      // If exists, remove it
      setActive(active.filter((s) => s !== status));
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));

      // Ensure userProfile is defined and contains user._id
      if (userProfile && userProfile.user && userProfile.user._id) {
        const response = await dispatch(
          getClients({
            userId: userProfile.user._id,
            search: searchTerm,
            status: active,
          })
        );
        setData(response?.payload?.data);
      }

      dispatch(setLoading(false));
    };

    fetchData();
  }, [active, dispatch, searchTerm, userProfile]);
  const handleRequestCompletion = (id) => {
    dispatch(setLoading(true));
    dispatch(
      requestCompletion({
        dynamicParams: { id: id },
        bodyData: {},
      })
    )
      .then(() => {
        // After adding Proposal, fetch the updated profile data
        dispatch(
          getClients({
            userId: userProfile.user._id,
            search: searchTerm,
            status: active,
          })
        );
        setShowRequestModal(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    dispatch(setLoading(false));
  };
  const handleAcceptInvitation = (id) => {
    dispatch(setLoading(true));
    dispatch(
      acceptJob({
        dynamicParams: { jobId: id, userId: userProfile?.user?._id },
        bodyData: {},
      })
    )
      .then(() => {
        // After adding Proposal, fetch the updated profile data
        dispatch(
          getClients({
            userId: userProfile.user._id,
            search: searchTerm,
            status: active,
          })
        );
        setShowInvitationModal(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    dispatch(setLoading(false));
  };
  console.log(data, loading);

  // Toggle show more reviews
  const [displayedRemainingReviews, setDisplayedRemainingReviews] =
    useState(12);

  const loadMoreReviews = () => {
    setDisplayedRemainingReviews((prev) => prev + 12);
  };

  const showLessReviews = () => {
    setDisplayedRemainingReviews(12);
  };
  return (
    <ProtectedRoute>
      <Navbar />
      <div className=" max-w-screen-xl  my-28 mx-2 lg:mx-auto  lg:grid grid-cols-4 gap-x-6">
        <div className="col-span-3">
          <div className="relative flex items-center w-full border h-12 rounded-3xl  bg-white overflow-hidden">
            <div className="grid place-items-center h-full w-12 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              className="peer h-full w-full outline-none text-sm text-secondary pr-2"
              type="text"
              id="search"
              placeholder="Search for jobs"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-span-1 lg:hidden block">
            {/* Status filters */}
            <p className=" my-4  font-medium text-2xl">Status</p>
            <div className="w-full  border mt-3 rounded-3xl  bg-[#ffffff] overflow-hidden py-3 px-6">
              {/* Checkbox options */}
              {["", "inprogress", "completed", "canceled", "invited"].map(
                (status, index) => (
                  <div
                    className="flex items-center my-2"
                    key={index}
                    onClick={() => handleCheckboxChange(status)}
                  >
                    <label
                      className={`relative flex cursor-pointer items-center rounded-full mr-2 ${
                        active.includes(status) && "bg-primary"
                      }`}
                      htmlFor={`checkbox-${index}`}
                      data-ripple-dark="true"
                    >
                      <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-primary transition-all before:absolute checked:border-primary checked:bg-primary"
                        checked={active.includes(status)}
                      />
                      <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth={1}
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </label>
                    <p className="text-secondary font-medium">
                      {status &&
                        status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
          <p className="lg:my-8 my-4 font-medium  text-2xl">
            My Clients ({data?.length ?? 0})
          </p>

          <div className="border rounded-3xl max-w-screen-xl  justify-center    mb-14 mx-auto">
            {loading ? (
              <div className="rounded-3xl max-w-screen-xl flex items-center justify-center h-[80vh]  mb-14  mx-auto">
                <div className="loader"></div>
              </div>
            ) : data?.length > 0 ? (
              [...data]
                ?.reverse()
                ?.slice(0, displayedRemainingReviews)
                ?.map((item, index) => (
                  <div
                    className={`w-full project-card pb-6 border-b  group transition-all p-3 shadow-none ${
                      data?.length - 1 === index && "border-none "
                    }`}
                    key={index}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-secondary">
                        Posted{" "}
                        {item?.createdAt &&
                          (({ timestamp }) => (
                            <span>
                              {formatDistance(new Date(timestamp), new Date(), {
                                addSuffix: true,
                              })}
                            </span>
                          ))({ timestamp: item?.createdAt })}
                      </p>
                    </div>
                    <div className="lg:flex space-y-2 lg:space-y-0 items-center mb-1">
                      <h2
                        className="text-xl font-semibold cursor-pointer hover:text-primary "
                        onClick={() => navigate(`/job/${item?._id}`)}
                      >
                        {item?.title}
                      </h2>
                      <button className="rounded-3xl lg:ml-2 px-4 py-1 text-sm bg-primary bg-opacity-[0.18] text-secondary text-center active:scale-95 ">
                        {item?.status}
                      </button>
                      <button className="rounded-3xl ml-2 px-4 py-1 text-sm bg-primary bg-opacity-[0.18] text-secondary text-center active:scale-95 ">
                        {item?.category?.name}
                      </button>
                    </div>

                    <div className="flex items-center  ">
                      <p className=" pt-3 text-secondary ">
                        Budget :{" "}
                        <span className="font-medium">
                          ${item?.budget ?? 0}
                        </span>{" "}
                        |
                      </p>

                      <p className=" pt-3 text-secondary ml-1">
                        Duration :{" "}
                        <span className="font-medium">
                          {item?.deadline ?? 0} days
                        </span>
                      </p>
                    </div>
                    <Description
                      description={item?.job_description}
                      className="py-3 text-green-900"
                    />

                    <p className="text-md  text-secondary">Client : </p>
                    <div>
                      <div className="lg:flex items-start justify-between mb-2">
                        <div
                          className="lg:flex items-center gap-x-2 cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/profile/${item?.client_profile?.user?._id}`
                            )
                          }
                        >
                          {item?.client_profile?.user?.profile_picture ? (
                            <div className="w-[78px] h-[78px] border rounded-full  relative">
                              <img
                                src={
                                  item?.client_profile?.user?.profile_picture
                                }
                                width={78}
                                height={78}
                                alt="profile picture"
                                className="object-cover rounded-full w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="w-[78px] h-[78px] border bg-primary flex items-center justify-center rounded-full hover:cursor-pointer relative">
                              <p className="text-2xl text-white">
                                {(item?.client_profile?.user?.first_name?.slice(
                                  0,
                                  1
                                ) ?? "") +
                                  (item?.client_profile?.user?.lastName?.slice(
                                    0,
                                    1
                                  ) ?? "")}
                              </p>
                            </div>
                          )}

                          <div>
                            <p className="text-xl text-secondary font-semibold">
                              {item?.client_profile?.user?.first_name +
                                " " +
                                item?.client_profile?.user?.lastName}{" "}
                            </p>

                            <div className="lg:flex items-center space-y-1 lg:space-y-0 gap-x-2">
                              <div className=" text-secondary flex items-center gap-x-2 font-medium">
                                <Rating
                                  style={{ maxWidth: 100 }}
                                  value={item?.client_profile?.overall_rating}
                                  readOnly
                                  itemStyles={{
                                    itemShapes: StickerStar,
                                    activeFillColor: "#35B900",
                                    inactiveFillColor: "#cecece",
                                  }}
                                />

                                <p className="font-medium  text-secondary">
                                  {" "}
                                  {item?.client_profile?.overall_rating?.toFixed(
                                    2
                                  )}
                                </p>
                                <p>
                                  ({item?.client_profile?.completed_projects}{" "}
                                  reviews)
                                </p>
                              </div>
                              <p className="flex items-center ">
                                <MdOutlineLocationOn className="w-6 h-6 mr-1 -ml-1 text-secondary" />
                                <span className="text-lg text-secondary">
                                  {item?.client_profile?.city},{" "}
                                  {item?.client_profile?.country}
                                </span>
                              </p>
                            </div>
                            <p className="text-secondary font-medium ">
                              {item?.client_profile?.category?.name} |{" "}
                              {item?.client_profile?.sub_title}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg text-secondary  font-semibold mb-[2px]">
                            ${item?.client_profile?.hourly_rate ?? 0}/hr
                          </p>
                        </div>
                      </div>
                      {item?.status === "inprogress" ? (
                        <div className="flex items-center justify-end gap-x-2">
                          <button
                            className="rounded px-4 py-2 border-red-400 border text-red-400 text-center active:scale-95 transition-all hover:bg-opacity-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              // setShowCancelJobModal(item?._id);
                            }}
                          >
                            Cancel Job
                          </button>
                          <button
                            className="rounded px-4 py-2 border-primary border text-white bg-primary text-center active:scale-95 transition-all hover:bg-opacity-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowRatingsModal(item?._id);
                            }}
                          >
                            Mark as complete
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-x-2">
                          <button
                            className="rounded px-4 py-2 border-primary border text-white bg-primary text-center active:scale-95 transition-all hover:bg-opacity-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              // setShowHireNowModal(
                              //   item?.client_profile?.user?._id
                              // );
                            }}
                          >
                            Hire Again
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex items-center justify-center">
                <img
                  src="/assets/404.png"
                  width={400}
                  height={400}
                  alt="No Data Found"
                />
              </div>
            )}
            <div
              className={`flex items-center justify-center gap-x-2 col-span-3 `}
            >
              {data?.length > displayedRemainingReviews && (
                <div className="flex items-center justify-center my-4">
                  <button
                    className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                    onClick={loadMoreReviews}
                  >
                    Load more
                  </button>
                </div>
              )}
              {displayedRemainingReviews > 12 && (
                <div className="flex items-center justify-center my-4">
                  <button
                    className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                    onClick={showLessReviews}
                  >
                    Show less
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1 hidden lg:block">
          {/* Status filters */}
          <p className="lg:my-8 my-4  font-medium text-2xl">Status</p>
          <div className="w-full h-1/2 border mt-6 rounded-3xl min-h-[50vh] bg-[#ffffff] overflow-hidden py-3 px-6">
            {/* Checkbox options */}
            {["", "inprogress", "completed", "canceled", "invited"].map(
              (status, index) => (
                <div
                  className="flex items-center my-2"
                  key={index}
                  onClick={() => handleCheckboxChange(status)}
                >
                  <label
                    className={`relative flex cursor-pointer items-center rounded-full mr-2 ${
                      active.includes(status) && "bg-primary"
                    }`}
                    htmlFor={`checkbox-${index}`}
                    data-ripple-dark="true"
                  >
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-primary transition-all before:absolute checked:border-primary checked:bg-primary"
                      checked={active.includes(status)}
                    />
                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </label>
                  <p className="text-secondary font-medium">
                    {status && status.charAt(0).toUpperCase() + status.slice(1)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
      <AnimatePresence initial={false} onExitComplete={() => null}>
        {showRatingsModal && (
          <RatingsModal
            setShowRatingsModal={setShowRatingsModal}
            showRatingsModal={showRatingsModal}
            userProfile={userProfile}
            isForClient={true}
          />
        )}
        {showRequestModal && (
          <ConfirmationModal
            title="request the client to mark the job as completed"
            loading={loading}
            onClose={() => setShowRequestModal(null)}
            onConfirm={() => handleRequestCompletion(showRequestModal)}
          />
        )}
        {showInvitationModal && (
          <ConfirmationModal
            title="accept the job"
            loading={loading}
            onClose={() => setShowInvitationModal(null)}
            onConfirm={() => handleAcceptInvitation(showInvitationModal)}
          />
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
};

export default MyFreelancers;
