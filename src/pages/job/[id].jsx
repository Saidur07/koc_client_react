import Footer from "../../components/layouts/Footer";
import Navbar from "../../components/layouts/Navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlArrowLeftCircle } from "react-icons/sl";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaHandHoldingDollar, FaStar } from "react-icons/fa6";
import {
  MdAccessTime,
  MdBookmarkAdded,
  MdDelete,
  MdEdit,
  MdJoinInner,
  MdOutlineLocationOn,
  MdOutlinePermIdentity,
  MdOutlineReviews,
} from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import { Rating, StickerStar } from "@smastrom/react-rating";
import { useForm } from "react-hook-form";
import {
  getJobById,
  addBookmark,
  addProposal,
  deleteBookmark,
  deleteProposal,
  acceptProposal,
  deleteJob,
} from "../../axios/axios";
import { FaRegBookmark, FaRegUserCircle } from "react-icons/fa";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { format, formatDistance } from "date-fns";

import Description from "../../components/ui/Description";
import { AnimatePresence } from "framer-motion";
import DeleteModal from "../../components/modals/DeleteModal";
import ProposalModal from "../../components/modals/ProposalModal";
import JobsModal from "../../components/modals/JobsModal";
import { Link } from "react-router-dom";
import ProtectedRoute from "../../components/layouts/ProtectedRoute";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { RxCross1 } from "react-icons/rx";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

const Job = () => {
  // Next.js router
  const navigate = useNavigate();

  const { id } = useParams();
  // Component state
  const userProfile = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.jobs.jobData?.data);
  const isLoading = useSelector((state) => state.loading.loading);
  const [date, setDate] = useState(null);
  const [sort, setSort] = useState("Newest");
  const [showConfirmationModal, setShowConfirmationModal] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        await dispatch(
          getJobById({ userId: userProfile?.user?._id, jobId: id, sort: sort })
        );
      } catch (error) {
        console.error("Error fetching job data:", error);
      }

      setDate(new Date(jobData?.profile?.createdAt));
      dispatch(setLoading(false));
    };

    fetchData();
  }, [dispatch, id, jobData?.profile?.createdAt, sort, userProfile]);

  console.log(jobData, isLoading);

  // console.log(jobData, isLoading);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (
      userProfile?.description &&
      userProfile?.hourly_rate &&
      userProfile?.sub_title
    ) {
      dispatch(setLoading(true));
      dispatch(
        addProposal({
          dynamicParams: { userId: userProfile?.user?._id },
          bodyData: { ...data, offer: id, created_by: userProfile?.user?._id },
        })
      )
        .then(() => {
          dispatch(getJobById({ userId: userProfile?.user?._id, jobId: id }));
        })
        .then(() => {
          dispatch(setLoading(false));
          reset();
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    } else {
      toast.error("Please complete your profile first");
      navigate("/profile/me");
    }
  };

  const handleAddBookmark = (id) => {
    dispatch(setLoading(true));
    dispatch(
      addBookmark({
        dynamicParams: {},
        bodyData: {
          user: userProfile?.user?._id,
          offer: id,
        },
      })
    )
      .then(() => {
        // After adding experience, fetch the updated profile data
        return dispatch(
          getJobById({ userId: userProfile?.user?._id, jobId: id })
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    dispatch(setLoading(false));
  };
  const handleDeleteBookmark = (id) => {
    dispatch(setLoading(true));
    dispatch(
      deleteBookmark({
        dynamicParams: { bookmarkId: id },
        bodyData: null,
      })
    )
      .then(() => {
        // After adding experience, fetch the updated profile data
        return dispatch(
          getJobById({ userId: userProfile?.user?._id, jobId: id })
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    dispatch(setLoading(false));
  };
  const [showDeleteProposalModal, setShowDeleteProposalModal] = useState(null);
  const [showEditProposalModal, setShowEditProposalModal] = useState(null);

  const handleAcceptProposal = (proposalId) => {
    dispatch(setLoading(true));
    dispatch(
      acceptProposal({
        dynamicParams: { proposalId: proposalId, jobId: id },
        bodyData: {},
      })
    )
      .then(() => {
        // After adding Proposal, fetch the updated profile data
        dispatch(getJobById({ userId: userProfile?.user?._id, jobId: id }));
        navigate("/myhires");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    dispatch(setLoading(false));
  };
  const handleDeleteProposal = () => {
    dispatch(setLoading(true));
    dispatch(
      deleteProposal({
        dynamicParams: { proposalId: showDeleteProposalModal },
        bodyData: null,
      })
    )
      .then(() => {
        // After adding Proposal, fetch the updated profile data
        return dispatch(
          getJobById({ userId: userProfile?.user?._id, jobId: id })
        );
      })
      .then(() => {
        // Once profile is fetched, reset loading state and close modal
        setShowDeleteProposalModal(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    dispatch(setLoading(false));
  };
  const [proposalData, setProposalData] = useState({
    bid_amount: 0,
    delivery_time: 0,
    proposal_description: "",
  });

  const [displayedRemainingReviews, setDisplayedRemainingReviews] =
    useState(10);

  const loadMoreReviews = () => {
    setDisplayedRemainingReviews((prev) => prev + 10);
  };

  const showLessReviews = () => {
    setDisplayedRemainingReviews(10);
  };

  const [showEditJobModal, setShowEditJobModal] = useState(null);
  const [showDeleteExperienceModal, setShowDeleteExperienceModal] =
    useState(null);

  const handleDeleteExperience = () => {
    dispatch(setLoading(true));
    dispatch(
      deleteJob({
        dynamicParams: { jobId: showDeleteExperienceModal },
        bodyData: null,
      })
    )
      .then(() => {
        // After adding experience, fetch the updated profile data
        navigate("/jobs");
      })
      .then(() => {
        // Once profile is fetched, reset loading state and close modal
        setShowDeleteExperienceModal(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    dispatch(setLoading(false));
  };

  return (
    <ProtectedRoute>
      <Navbar />
      {isLoading ? (
        <div className=" max-w-screen-xl  my-28 mx-2 lg:mx-auto lg:grid grid-cols-4 gap-x-6">
          <div className="border rounded-3xl max-w-screen-xl p-6  mb-14 mx-auto col-span-3 w-full flex items-center justify-center h-[120vh]">
            <div className="loader"></div>
          </div>{" "}
          <div className="col-span-1">
            <div className=" w-full border rounded-3xl h-[30vh]  bg-[#fff] overflow-hidden py-3 px-6">
              <p className="text-lg  my-6 font-semibold text-secondary">
                About The Client
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className=" max-w-screen-xl  my-28 mx-2 lg:mx-auto lg:grid grid-cols-4 gap-x-6">
          <div className="border rounded-3xl max-w-screen-xl  justify-center  p-6  mb-14 mx-auto col-span-3 w-full">
            <div className="flex items-center gap-x-2">
              <SlArrowLeftCircle
                className="text-primary text-xl cursor-pointer transition-all hover:text-secondary"
                onClick={() => navigate("/jobs")}
              />{" "}
              <p className="text-sm text-secondary">
                Posted{" "}
                {jobData?.createdAt &&
                  (({ timestamp }) => (
                    <span>
                      {formatDistance(new Date(timestamp), new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  ))({ timestamp: jobData?.createdAt })}
              </p>
            </div>
            {jobData?.user !== userProfile?.user?._id ? (
              <div className="lg:flex space-y-2 lg:space-y-0 items-center my-2">
                <p className=" font-medium text-2xl">{jobData?.title}</p>{" "}
                <button className="rounded-3xl lg:ml-2 px-4 py-1 text-sm bg-primary bg-opacity-[0.18] text-secondary text-center active:scale-95 ">
                  {jobData?.status}
                </button>
                <button className="rounded-3xl ml-2 px-4 py-1 text-sm bg-primary bg-opacity-[0.18] text-secondary text-center active:scale-95 ">
                  {jobData?.category?.name}
                </button>
              </div>
            ) : (
              <div className="lg:flex space-y-2 lg:space-y-0 items-center my-2 justify-between">
                {" "}
                <div className="flex items-start">
                  <p className=" font-medium text-2xl">{jobData?.title}</p>{" "}
                  <button className="rounded-3xl lg:ml-2 px-4 py-1 text-sm bg-primary bg-opacity-[0.18] text-secondary text-center active:scale-95 ">
                    {jobData?.status}
                  </button>
                  <button className="rounded-3xl mx-2 px-4 py-1 text-sm bg-primary bg-opacity-[0.18] text-secondary text-center active:scale-95 text-nowrap">
                    {jobData?.category?.name}
                  </button>
                </div>{" "}
                <div className="flex items-start gap-x-2">
                  <div
                    className="rounded-full p-[6px] border-[1px] border-primary hover:bg-gray-50 cursor-pointer transition-all"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling up
                      setShowEditJobModal(jobData?._id);
                    }}
                  >
                    <MdEdit className="text-primary text-lg" />
                  </div>
                  <div
                    className="rounded-full p-[6px] border-[1px] border-primary hover:bg-gray-50 cursor-pointer transition-all"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling up
                      setShowDeleteExperienceModal(jobData?._id);
                    }}
                  >
                    <MdDelete className="text-primary text-lg" />
                  </div>
                </div>{" "}
              </div>
            )}
            <p className="py-3 text-green-900">{jobData?.job_description}</p>
            <div className="flex justify-between items-center"></div>
            <div className="lg:flex items-center  ">
              <p className=" lg:py-3 text-secondary ">
                Est. budget :{" "}
                <span className="font-medium">${jobData?.budget}</span> |
              </p>

              <p className=" lg:py-3 text-secondary lg:ml-1">
                Est. duration :{" "}
                <span className="font-medium">{jobData?.deadline} days</span> |
              </p>
              <p className=" lg:py-3 text-secondary lg:ml-1">
                Project size :{" "}
                <span className="font-medium">{jobData?.project_size} </span>
              </p>
            </div>
            <p className="text-md py-3 font-medium text-secondary">
              Required skills :
            </p>
            <div className="flex flex-wrap gap-x-2  gap-y-2 mb-3">
              {jobData?.skills?.map((element, idx) => (
                <div key={`skillset-${idx}`}>
                  <button className="rounded-3xl px-3 py-1  bg-gray-400 bg-opacity-[0.18] text-secondary text-center active:scale-95 ">
                    {element?.name}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-md  text-secondary">
              Proposals :{" "}
              <span className="font-medium">{jobData?.proposals?.length}</span>
            </p>

            {jobData?.user !== userProfile?.user?._id && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-t py-6 my-6">
                  <p className="text-2xl font-medium mb-6">Place a bid</p>
                  {/* Conditional rendering based on proposals */}

                  {jobData?.proposals?.some(
                    (proposal) =>
                      proposal?.created_by?._id === userProfile?.user?._id
                  ) ? (
                    <p>You have already placed a bid for this job.</p>
                  ) : jobData?.status !== "open" ? (
                    <p>Bidding has ended on this job.</p>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="w-1/2">
                            <label
                              htmlFor="bid_amount"
                              className="font-medium text-sm"
                            >
                              Bid Amount (USD)
                            </label>
                            <input
                              type="number"
                              id="bid_amount"
                              {...register("bid_amount", { required: true })}
                              className="w-full rounded-md border mt-1 border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="Ex. 500"
                            />
                            {errors.bid_amount && (
                              <span className="text-red-500">
                                This field is required
                              </span>
                            )}
                          </div>
                          <div className="w-1/2">
                            <label
                              htmlFor="delivery_time"
                              className="font-medium text-sm"
                            >
                              Delivery Time (Days)
                            </label>
                            <input
                              type="number"
                              id="delivery_time"
                              {...register("delivery_time", { required: true })}
                              className="w-full rounded-md border mt-1  border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="Ex. 5"
                            />
                            {errors.delivery_time && (
                              <span className="text-red-500">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <label
                            htmlFor="proposal_description"
                            className="font-medium text-sm"
                          >
                            Proposal Description
                          </label>
                          <textarea
                            id="proposal_description"
                            rows={6}
                            {...register("proposal_description", {
                              required: true,
                            })}
                            className="w-full rounded-md border mt-1 border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="What makes you the best candidate for this project?"
                          />
                          {errors.proposal_description && (
                            <span className="text-red-500">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="lg:flex-row flex-col-reverse gap-y-2 lg:gap-y-0 flex items-center justify-between gap-x-3 mt-4">
                        {jobData?.hasBeenBookmarked ? (
                          <div
                            className="cursor-pointer rounded-3xl  w-full py-3 border border-primary hover:bg-opacity-90 transition-all  text-primary text-center active:scale-95"
                            onClick={() => handleDeleteBookmark(jobData?._id)}
                          >
                            <p className="flex items-center justify-center gap-x-2">
                              <MdBookmarkAdded className="text-primary text-xl cursor-pointer transition-all hover:opacity-90" />{" "}
                              Bookmarked
                            </p>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer rounded-3xl  w-full py-3 border border-primary hover:bg-opacity-90 transition-all  text-primary text-center active:scale-95"
                            onClick={() => handleAddBookmark(jobData?._id)}
                          >
                            <p className="flex items-center justify-center gap-x-2">
                              <FaRegBookmark className="text-primary text-xl cursor-pointer transition-all hover:opacity-90" />{" "}
                              Bookmark for later
                            </p>
                          </div>
                        )}
                        <button
                          type="submit"
                          className="rounded-3xl  w-full py-3 bg-primary hover:bg-opacity-90 transition-all border text-white text-center active:scale-95"
                        >
                          Apply
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </form>
            )}
            <div>
              <div className="flex justify-between items-center mt-4 py-4 mb-6 border-t">
                <p className="text-xl lg:text-2xl  font-medium ">
                  All Proposals ({jobData?.proposals?.length})
                </p>
                <div className="flex flex-col mx-2">
                  {" "}
                  <label htmlFor="sort" className=" font-medium">
                    Sort By
                  </label>
                  <select
                    id="sort"
                    className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary lg:w-48"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
              </div>
              <div>
                {jobData?.proposals?.length > 0 ? (
                  <>
                    {/* Proposals from the user */}
                    {jobData?.proposals
                      ?.filter(
                        (item) =>
                          item?.created_by?._id === userProfile?.user?._id
                      )
                      ?.map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 transition-all  hover:rounded-xl border-b  ${
                            jobData?.proposals?.length - 1 === index &&
                            "border-none "
                          }`}
                        >
                          <div className="lg:hidden flex justify-end -mb-12 flex-col items-end">
                            <p className="text-2xl text-secondary  font-semibold mb-[2px]">
                              ${item?.bid_amount}
                            </p>
                            <p className="font-medium text-secondary">
                              in {item?.delivery_time} days
                            </p>
                          </div>
                          <div className="lg:flex space-y-2 lg:space-y-0 items-start justify-between mb-2">
                            <div
                              className="lg:flex items-center gap-x-2 cursor-pointer group"
                              onClick={() => navigate(`/profile/me`)}
                            >
                              {item?.created_by?.profile?.user
                                .profile_picture ? (
                                <div className="w-[78px] h-[78px] border rounded-full  relative">
                                  <img
                                    src={
                                      item?.created_by?.profile?.user
                                        ?.profile_picture
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
                                    {(item?.created_by?.first_name?.slice(
                                      0,
                                      1
                                    ) ?? "") +
                                      (item?.created_by?.lastName?.slice(
                                        0,
                                        1
                                      ) ?? "")}
                                  </p>
                                </div>
                              )}

                              <div className="">
                                <div className="flex items-center gap-x-2">
                                  <p className="text-xl text-secondary group-hover:text-primary transition-all font-semibold">
                                    {item?.created_by?.first_name +
                                      " " +
                                      item?.created_by?.lastName}{" "}
                                  </p>
                                  {item?.accepted && (
                                    <span className="rounded-3xl px-2 py-1  border-primary border text-primary bg-white text-center active:scale-95 transition-all hover:bg-opacity-90">
                                      Accepted
                                    </span>
                                  )}
                                </div>
                                <div className="lg:flex items-center gap-x-2">
                                  <div className=" text-secondary flex items-center gap-x-2 font-medium">
                                    <Rating
                                      style={{ maxWidth: 100 }}
                                      value={
                                        item?.created_by?.profile
                                          ?.overall_rating
                                      }
                                      readOnly
                                      itemStyles={{
                                        itemShapes: StickerStar,
                                        activeFillColor: "#35B900",
                                        inactiveFillColor: "#cecece",
                                      }}
                                    />

                                    <p className="font-medium  text-secondary">
                                      {" "}
                                      {item?.created_by?.profile?.overall_rating?.toFixed(
                                        2
                                      )}
                                    </p>
                                    <p>
                                      (
                                      {
                                        item?.created_by?.profile
                                          ?.completed_projects
                                      }{" "}
                                      reviews)
                                    </p>
                                  </div>
                                  <p className="flex items-center ">
                                    <MdOutlineLocationOn className="w-6 h-6 mr-1 -ml-1 text-secondary" />
                                    <span className="text-lg text-secondary">
                                      {item?.created_by?.profile?.city},{" "}
                                      {item?.created_by?.profile?.country}
                                    </span>
                                  </p>
                                </div>
                                <p className="text-secondary font-medium ">
                                  {item?.created_by?.profile?.category?.name} |{" "}
                                  {item?.created_by?.profile?.sub_title}
                                </p>
                              </div>
                            </div>
                            <div className="hidden lg:block">
                              <p className="text-2xl text-secondary  font-semibold mb-[2px]">
                                ${item?.bid_amount}
                              </p>
                              <p className="font-medium text-secondary">
                                in {item?.delivery_time} days
                              </p>
                            </div>
                          </div>
                          <p className="text-secondary ">
                            <Description
                              description={
                                item?.proposal_description
                                  ? item?.proposal_description
                                  : ""
                              }
                              maxLines={1}
                              className={"text-secondary"}
                            />
                          </p>
                          <p className=" text-secondary mt-2">
                            Applied{" "}
                            {item?.createdAt &&
                              (({ timestamp }) => (
                                <span>
                                  {formatDistance(
                                    new Date(timestamp),
                                    new Date(),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </span>
                              ))({
                                timestamp: item?.createdAt,
                              })}
                          </p>
                          <div className="flex items-center my-4 lg:my-0 justify-end gap-x-2">
                            <button
                              className="rounded px-6 py-2 border-red-500 border text-red-500 text-center active:scale-95 transition-all hover:bg-opacity-90"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent event from bubbling up
                                setShowDeleteProposalModal(item?._id);
                              }}
                            >
                              Delete
                            </button>
                            <button
                              className="rounded px-6 py-2 border-primary border text-white bg-primary text-center active:scale-95 transition-all hover:bg-opacity-90"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent event from bubbling up
                                setProposalData({
                                  bid_amount: item?.bid_amount,
                                  delivery_time: item?.delivery_time,
                                  proposal_description:
                                    item?.proposal_description,
                                });
                                setShowEditProposalModal(item?._id);
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    {/* Other proposals */}
                    {jobData?.proposals
                      ?.filter(
                        (item) =>
                          item?.created_by?._id !== userProfile?.user?._id
                      )
                      ?.map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 transition-all   hover:rounded-xl border-b  ${
                            jobData?.proposals?.length - 1 === index &&
                            "border-none "
                          }`}
                        >
                          <div className="lg:hidden flex justify-end -mb-12 flex-col items-end">
                            <p className="text-2xl text-secondary  font-semibold mb-[2px]">
                              ${item?.bid_amount}
                            </p>
                            <p className="font-medium text-secondary">
                              in {item?.delivery_time} days
                            </p>
                          </div>
                          <div className="lg:flex space-y-2 lg:space-y-0 items-start justify-between mb-2">
                            <div
                              className="lg:flex items-center gap-x-2 cursor-pointer group"
                              onClick={() =>
                                navigate(
                                  `/profile/${item?.created_by?.profile?.user}`
                                )
                              }
                            >
                              {item?.created_by?.profile?.user
                                .profile_picture ? (
                                <div className="w-[78px] h-[78px] border rounded-full  relative">
                                  <img
                                    src={
                                      item?.created_by?.profile?.user
                                        ?.profile_picture
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
                                    {(item?.created_by?.first_name?.slice(
                                      0,
                                      1
                                    ) ?? "") +
                                      (item?.created_by?.lastName?.slice(
                                        0,
                                        1
                                      ) ?? "")}
                                  </p>
                                </div>
                              )}

                              <div className="">
                                <div className="flex items-center gap-x-2">
                                  <p className="text-xl text-secondary group-hover:text-primary transition-all font-semibold">
                                    {item?.created_by?.first_name +
                                      " " +
                                      item?.created_by?.lastName}{" "}
                                  </p>
                                  {item?.accepted && (
                                    <span className="rounded-3xl px-2 py-1  border-primary border text-primary bg-white text-center active:scale-95 transition-all hover:bg-opacity-90">
                                      Accepted
                                    </span>
                                  )}
                                </div>
                                <div className="lg:flex items-center gap-x-2">
                                  <div className=" text-secondary flex items-center gap-x-2 font-medium">
                                    <Rating
                                      style={{ maxWidth: 100 }}
                                      value={
                                        item?.created_by?.profile
                                          ?.overall_rating
                                      }
                                      readOnly
                                      itemStyles={{
                                        itemShapes: StickerStar,
                                        activeFillColor: "#35B900",
                                        inactiveFillColor: "#cecece",
                                      }}
                                    />

                                    <p className="font-medium  text-secondary">
                                      {" "}
                                      {item?.created_by?.profile?.overall_rating?.toFixed(
                                        2
                                      )}
                                    </p>
                                    <p>
                                      (
                                      {
                                        item?.created_by?.profile
                                          ?.completed_projects
                                      }{" "}
                                      reviews)
                                    </p>
                                  </div>
                                  <p className="flex items-center ">
                                    <MdOutlineLocationOn className="w-6 h-6 mr-1 -ml-1 text-secondary" />
                                    <span className="text-lg text-secondary">
                                      {item?.created_by?.profile?.city},{" "}
                                      {item?.created_by?.profile?.country}
                                    </span>
                                  </p>
                                </div>
                                <p className="text-secondary font-medium ">
                                  {item?.created_by?.profile?.category?.name} |{" "}
                                  {item?.created_by?.profile?.sub_title}
                                </p>
                              </div>
                            </div>
                            <div className="hidden lg:block">
                              <p className="text-2xl text-secondary  font-semibold mb-[2px]">
                                ${item?.bid_amount}
                              </p>
                              <p className="font-medium text-secondary">
                                in {item?.delivery_time} days
                              </p>
                            </div>
                          </div>
                          <p className="text-secondary ">
                            <Description
                              description={
                                item?.proposal_description
                                  ? item?.proposal_description
                                  : "sss"
                              }
                              maxLines={1}
                              className={"text-secondary"}
                            />
                          </p>
                          <p className=" text-secondary mt-2">
                            Applied{" "}
                            {item?.created_by?.createdAt &&
                              (({ timestamp }) => (
                                <span>
                                  {formatDistance(
                                    new Date(timestamp),
                                    new Date(),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </span>
                              ))({
                                timestamp: item?.created_by?.createdAt,
                              })}
                          </p>
                          {jobData?.user === userProfile?.user?._id &&
                            jobData?.status === "open" && (
                              <div className="flex items-center my-4 lg:my-0 justify-end gap-x-2">
                                <button
                                  className="rounded px-6 py-2 border-primary border text-primary bg-white text-center active:scale-95 transition-all hover:bg-opacity-90"
                                  disabled
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  Initiate Chat
                                </button>
                                <button
                                  className="rounded px-6 py-2 border-primary border text-white bg-primary text-center active:scale-95 transition-all hover:bg-opacity-90"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowConfirmationModal(item?._id);
                                  }}
                                >
                                  Accept Proposal
                                </button>
                              </div>
                            )}
                        </div>
                      ))}
                  </>
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

                <div className={`flex items-center justify-center gap-x-2 `}>
                  {jobData?.proposals?.length > displayedRemainingReviews && (
                    <div className="flex items-center justify-center my-4">
                      <button
                        className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                        onClick={loadMoreReviews}
                      >
                        Load more
                      </button>
                    </div>
                  )}
                  {displayedRemainingReviews > 10 && (
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
          </div>
          <div className="col-span-1">
            <div className=" w-full  border rounded-3xl  bg-[#fff] overflow-hidden py-6 px-6">
              <p className="text-lg  mb-6 font-semibold text-secondary">
                About The Client
              </p>
              <p className="flex items-center mt-2">
                <MdOutlinePermIdentity className="w-6 h-6 mr-1 -ml-1 text-secondary" />
                <Link
                  className="text-lg text-secondary hover:text-primary cursor-pointer"
                  href={`/profile/${jobData?.profile?.user?._id}`}
                >
                  {jobData?.profile?.user?.first_name}{" "}
                  {jobData?.profile?.user?.lastName}
                </Link>
              </p>
              <div className=" text-secondary mt-2 flex items-center  ">
                <MdOutlineReviews className="w-6 h-6 mr-1 -ml-1 text-secondary" />
                <Rating
                  style={{ maxWidth: 100 }}
                  value={jobData?.profile?.overall_rating}
                  readOnly
                  itemStyles={{
                    itemShapes: StickerStar,
                    activeFillColor: "#35B900",
                    inactiveFillColor: "#cecece",
                  }}
                />

                <p className="font-medium mx-1  text-secondary">
                  {" "}
                  {jobData?.profile?.overall_rating?.toFixed(2)}
                </p>
                <p>({jobData?.profile?.completed_projects} reviews)</p>
              </div>

              <p className="flex items-center mt-2">
                <MdOutlineLocationOn className="w-6 h-6 mr-1 -ml-1 text-secondary" />
                <span className="text-lg text-secondary">
                  {jobData?.profile?.city}, {jobData?.profile?.country}
                </span>
              </p>

              <p className="flex items-center mt-2">
                <MdJoinInner className="w-6 h-6 mr-1 -ml-1 text-secondary" />
                <span className="text-lg text-secondary">
                  Member since{" "}
                  {jobData &&
                    date &&
                    date != "Invalid Date" &&
                    format(date, "MMM dd, yyyy")}
                </span>
              </p>
              <p className="flex items-center mt-2">
                <FaHandHoldingDollar className="w-6 h-6 mr-1 -ml-1 text-secondary" />
                <span className="text-lg text-secondary">
                  ${jobData?.profile?.amount_earned} spent
                </span>
              </p>
              {jobData?.profile?.payment_verified ? (
                <div className="flex items-center mt-2 gap-x-1 text-secondary">
                  <RiVerifiedBadgeFill className="w-6 h-6 mr-1 -ml-1 text-secondary" />{" "}
                  <p className="text-lg">Payment Verified</p>
                </div>
              ) : (
                <div className="flex items-center mt-2 gap-x-1 text-secondary">
                  <VscUnverified className="w-6 h-6 mr-1 -ml-1 text-secondary" />{" "}
                  <p className="text-lg">Payment Unverified</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
      <AnimatePresence initial={false} onExitComplete={() => null}>
        {showEditJobModal && (
          <JobsModal
            setShowJobsModal={setShowEditJobModal}
            showJobsModal={showEditJobModal}
            userProfile={userProfile}
            isEdit={true}
            isDetail={true}
            initialData={{
              title: jobData?.title,
              budget: jobData?.budget,
              deadline: jobData?.deadline,
              project_size: jobData?.project_size,
              job_description: jobData?.job_description,
              skills: jobData?.skills,
              category: jobData?.category,
              user: jobData?.profile?.user,
            }}
          />
        )}
        {showDeleteExperienceModal && (
          <DeleteModal
            title="Job"
            loading={isLoading}
            onClose={() => setShowDeleteExperienceModal(null)}
            onConfirm={() => handleDeleteExperience()}
          />
        )}
        {showEditProposalModal && (
          <ProposalModal
            setShowEditProposalModal={setShowEditProposalModal}
            showEditProposalModal={showEditProposalModal}
            userProfile={userProfile}
            initialData={proposalData}
            jobId={id}
          />
        )}
        {showDeleteProposalModal && (
          <DeleteModal
            title="Proposal"
            loading={isLoading}
            onClose={() => setShowDeleteProposalModal(null)}
            onConfirm={() => handleDeleteProposal()}
          />
        )}
        {showConfirmationModal && (
          <ConfirmationModal
            title="accept the proposal and continue"
            loading={isLoading}
            onClose={() => setShowConfirmationModal(null)}
            onConfirm={() => handleAcceptProposal(showConfirmationModal)}
          />
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
};

export default Job;
