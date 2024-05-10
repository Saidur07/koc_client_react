import React, { useState, useEffect } from "react";
import { FaRegBookmark } from "react-icons/fa";
import {
  MdDelete,
  MdEdit,
  MdOutlineLocationOn,
  MdVerified,
} from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Description from "../ui/Description";
import { useNavigate } from "react-router-dom";
import { VscUnverified } from "react-icons/vsc";
import { Rating, StickerStar } from "@smastrom/react-rating";
import { AnimatePresence } from "framer-motion";
import DeleteModal from "../modals/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteJob, getJobs } from "../../axios/axios";
import JobsModal from "../modals/JobsModal";
import {
  addBookmark,
  deleteBookmark,
  getBookmarks,
  getMyJobs,
} from "../../axios/axios";
import { MdBookmarkAdded } from "react-icons/md";
import { formatDistance } from "date-fns";
import { setLoading } from "../../redux/reducers/loadingSlice";

const ProjectCard = ({
  data,
  index,
  length,
  myJob,
  isBookmark,
  userProfile,
}) => {
  const {
    _id,
    createdAt,
    title,
    status,
    budget,
    deadline,
    project_size,
    skills,
    job_description,
    profile,
    user,
    category,
    hasBeenBookmarked,
  } = isBookmark ? data?.offer : data;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/job/${_id}`);
  };
  const dispatch = useDispatch();
  const [showDeleteExperienceModal, setShowDeleteExperienceModal] =
    React.useState(null);
  const loading = useSelector((state) => state.loading.loading);

  const handleDeleteExperience = async () => {
    await dispatch(setLoading(true));
    await dispatch(
      deleteJob({
        dynamicParams: { jobId: showDeleteExperienceModal },
        bodyData: null,
      })
    )
      .then(() => {
        // After adding experience, fetch the updated profile data
        dispatch(getJobs({ user_id: userProfile?.user?._id, search: "" }));
        dispatch(getBookmarks(userProfile?.user?._id));
        dispatch(getMyJobs(userProfile?.user?._id));
      })
      .then(() => {
        // Once profile is fetched, reset loading state and close modal
        setShowDeleteExperienceModal(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    await dispatch(setLoading(false));
  };
  const handleAddBookmark = async (id) => {
    await dispatch(setLoading(true));
    await dispatch(
      addBookmark({
        dynamicParams: {},
        bodyData: {
          user: userProfile?.user?._id,
          offer: id,
        },
      })
    )
      .then(async () => {
        // After adding experience, fetch the updated profile data
        await dispatch(
          getJobs({ user_id: userProfile?.user?._id, search: "" })
        );
        await dispatch(getBookmarks(userProfile?.user?._id));
        await dispatch(getMyJobs(userProfile?.user?._id));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    await dispatch(setLoading(false));
  };
  const handleDeleteBookmark = async (id) => {
    await dispatch(setLoading(true));
    await dispatch(
      deleteBookmark({
        dynamicParams: { bookmarkId: id },
        bodyData: null,
      })
    )
      .then(async () => {
        // After adding experience, fetch the updated profile data
        await dispatch(
          getJobs({ user_id: userProfile?.user?._id, search: "" })
        );
        await dispatch(getBookmarks(userProfile?.user?._id));
        await dispatch(getMyJobs(userProfile?.user?._id));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    await dispatch(setLoading(false));
  };
  const [showEditJobModal, setShowEditJobModal] = useState(null);
  return (
    <div
      className={`w-full project-card pb-6 border-b cursor-pointer hover:bg-gray-100 group transition-all p-3 shadow-none ${
        length - 1 === index && "border-none "
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm text-secondary">
          Posted{" "}
          {createdAt &&
            (({ timestamp }) => (
              <span>
                {formatDistance(new Date(timestamp), new Date(), {
                  addSuffix: true,
                })}
              </span>
            ))({ timestamp: createdAt })}
        </p>
        {myJob ? (
          <div className="flex items-center gap-x-2">
            <div
              className="rounded-full p-[6px] border-[1px] border-primary hover:bg-gray-50 cursor-pointer transition-all"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                setShowEditJobModal(_id);
              }}
            >
              <MdEdit className="text-primary text-lg" />
            </div>
            <div
              className="rounded-full p-[6px] border-[1px] border-primary hover:bg-gray-50 cursor-pointer transition-all"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                setShowDeleteExperienceModal(_id);
              }}
            >
              <MdDelete className="text-primary text-lg" />
            </div>
          </div>
        ) : hasBeenBookmarked || isBookmark ? (
          <MdBookmarkAdded
            className="text-primary text-2xl cursor-pointer transition-all hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              handleDeleteBookmark(data?._id);
            }}
          />
        ) : (
          <FaRegBookmark
            className="text-primary text-xl cursor-pointer transition-all hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              handleAddBookmark(_id);
            }}
          />
        )}
      </div>
      <div className="lg:flex space-y-2 lg:space-y-0 items-center mb-2">
        <h2 className="text-xl font-semibold group-hover:text-primary">
          {title}
        </h2>
        <button className="rounded-3xl lg:ml-2 px-4 py-1 text-sm bg-primary bg-opacity-[0.18] text-secondary text-center active:scale-95 ">
          {status}
        </button>
        <button className="rounded-3xl ml-2 px-4 py-1 text-sm bg-primary bg-opacity-[0.18] text-secondary text-center active:scale-95 ">
          {category?.name}
        </button>
      </div>
      <div className="lg:flex items-center pt-3 lg:pt-0 ">
        <p className="  text-secondary ">
          Est. budget : <span className="font-medium">${budget}</span> |
        </p>

        <p className="  text-secondary lg:ml-1">
          Est. duration : <span className="font-medium">{deadline} days</span> |
        </p>
        <p className="  text-secondary lg:ml-1">
          Project size : <span className="font-medium">{project_size} </span>
        </p>
      </div>
      <Description
        description={job_description}
        className="py-3 text-green-900"
      />
      {!myJob && (
        <div className="lg:flex space-y-1 lg:space-y-0 justify-start gap-x-6 items-center">
          {profile?.payment_verified ? (
            profile?.payment_verified
          ) : user?.profile?.payment_verified ? (
            <div className="flex items-center gap-x-1 text-secondary">
              <RiVerifiedBadgeFill /> Payment Verified{" "}
            </div>
          ) : (
            <div className="flex items-center gap-x-1 text-secondary">
              <VscUnverified /> Payment Unverified{" "}
            </div>
          )}

          <div className=" text-secondary flex items-center gap-x-2 font-medium">
            <Rating
              style={{ maxWidth: 100 }}
              value={
                profile?.client_rating
                  ? profile?.client_rating
                  : user?.profile?.client_rating ?? 0
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
              {profile?.client_overall_reviews
                ? profile?.client_overall_reviews?.toFixed(2)
                : user?.profile?.client_overall_reviews?.toFixed(2)}
            </p>
            <p>
              (
              {profile?.client_reviews?.length
                ? profile?.client_reviews?.length
                : user?.profile?.client_reviews?.length ?? 0}{" "}
              reviews)
            </p>
          </div>
          <p className="text-md  text-secondary">
            <span className="font-medium">
              $
              {profile?.amount_earned
                ? profile?.amount_earned
                : user?.profile?.amount_earned ?? 0}
            </span>{" "}
            spent
          </p>
          <p className="text-md  text-secondary">
            <span className="font-medium">
              {profile?.total_hired
                ? profile?.total_hired
                : user?.profile?.total_hired ?? 0}
            </span>{" "}
            hired
          </p>
          <p className="flex items-center">
            <MdOutlineLocationOn className="text-md mr-1 font-medium text-secondary" />
            <span className="text-md text-secondary ">
              {profile?.city ? profile?.city : user?.profile?.city},{" "}
              {profile?.country ? profile?.country : user?.profile?.country}
            </span>
          </p>
        </div>
      )}
      <div className="flex flex-wrap gap-x-2  gap-y-2 my-3">
        {skills?.map((element, idx) => (
          <div key={`skillset-${idx}`}>
            <button className="rounded-3xl px-3 py-1  bg-gray-400 bg-opacity-[0.18] text-secondary text-center active:scale-95 ">
              {element?.name}
            </button>
          </div>
        ))}
      </div>
      <p className="text-md  text-secondary">
        Proposals :{" "}
        <span className="font-medium">{data?.proposals?.length ?? 0} </span>
      </p>
      {data?.proposals?.some(
        (proposal) => proposal.created_by === userProfile?.user?._id
      ) && (
        <p className="text-md  text-secondary font-medium flex items-center gap-x-1 mt-1">
          <MdVerified /> You've already submitted your proposal on this job
        </p>
      )}
      <AnimatePresence initial={false} onExitComplete={() => null}>
        {showEditJobModal && (
          <JobsModal
            setShowJobsModal={setShowEditJobModal}
            showJobsModal={showEditJobModal}
            userProfile={userProfile}
            isEdit={true}
            initialData={{
              title: title,
              budget: budget,
              deadline: deadline,
              project_size: project_size,
              job_description: job_description,
              skills: skills,
              category: category,
              user: profile?.user,
            }}
          />
        )}
        {showDeleteExperienceModal && (
          <DeleteModal
            title="Job"
            loading={loading}
            onClose={() => setShowDeleteExperienceModal(null)}
            onConfirm={() => handleDeleteExperience()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectCard;
