/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { FiPlus } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import { deleteExperience, getProfile } from "../axios/axios";
import { setLoading } from "../redux/reducers/loadingSlice";
import { MdDelete, MdEdit } from "react-icons/md";
import DeleteModal from "../modals/DeleteModal";
import ExperienceModal from "../modals/ExperienceModal";
import Description from "../ui/Description";

const Experiences = ({ userProfile, isMine }) => {
  const dispatch = useDispatch();

  // Selecting necessary data from Redux store
  const loading = useSelector((state) => state.loading.loading);

  // State variables
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [showEditExperienceModal, setShowEditExperienceModal] = useState(null);
  const [showDeleteExperienceModal, setShowDeleteExperienceModal] =
    useState(null);

  const handleDeleteExperience = () => {
    dispatch(setLoading(true));
    dispatch(
      deleteExperience({
        dynamicParams: {
          userId: userProfile?.user?._id,
          experienceId: showDeleteExperienceModal,
        },
        bodyData: null,
      })
    )
      .then(() => {
        // After adding experience, fetch the updated profile data
        return dispatch(getProfile());
      })
      .then(() => {
        // Once profile is fetched, reset loading state and close modal
        dispatch(setLoading(false));
        setShowDeleteExperienceModal(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        dispatch(setLoading(false));
      });
  };

  const [editExperienceData, setEditExperienceData] = useState({
    company: "",
    title: "",
    city: "",
    country: "",
    from: null,
    to: null,
    current: false,
    description: "",
  });

  return (
    <div className="mx-2 border rounded-3xl max-w-screen-xl p-6 mt-8 mb-28 lg:mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-2xl lg:text-3xl font-semibold mb-4">
          Employment History
        </p>

        <div
          className={`rounded-full p-[6px] border-[1px] border-primary hover:bg-gray-50 cursor-pointer transition-all ${
            !isMine && "hidden"
          }`}
          onClick={() => setShowAddExperienceModal(true)}
        >
          <FiPlus className="text-primary text-lg" />
        </div>
      </div>
      {userProfile?.experience?.length > 0 ? (
        userProfile?.experience?.map((item, index) => (
          <div
            className={`my-2 py-6 ${
              userProfile?.experience?.length - 1 !== index && "border-b"
            }`}
            key={index}
          >
            <div className="flex items-center justify-between">
              <p className="text-2xl font-semibold mb-2">
                {item?.title} | {item?.company}
              </p>
              <div className="flex items-center gap-x-2">
                <div
                  className={`rounded-full p-[6px] border-[1px] border-primary hover:bg-gray-50 cursor-pointer transition-all ${
                    !isMine && "hidden"
                  }`}
                  onClick={() => {
                    setShowEditExperienceModal(item?._id);
                    setEditExperienceData({
                      company: item?.company,
                      city: item?.city,
                      country: item?.country,
                      title: item?.title,
                      current: item?.current,
                      description: item?.description,
                    });
                  }}
                >
                  <MdEdit className="text-primary text-lg" />
                </div>
                <div
                  className={`rounded-full p-[6px] border-[1px] border-primary hover:bg-gray-50 cursor-pointer transition-all ${
                    !isMine && "hidden"
                  }`}
                  onClick={() => setShowDeleteExperienceModal(item?._id)}
                >
                  <MdDelete className="text-primary text-lg" />
                </div>
              </div>
            </div>

            <p className=" font-medium text-lg text-secondary mb-2">
              {" "}
              {format(new Date(item?.from), "MMMM, yyyy")} -{" "}
              {item?.current
                ? "Present"
                : format(new Date(item?.to), "MMMM, yyyy")}
            </p>
            <Description
              description={item?.description ? item?.description : ""}
              maxLines={5}
              className={"text-secondary text-lg"}
            />
          </div>
        ))
      ) : (
        <p className=" text-secondary my-2">No data to show. </p>
      )}
      <AnimatePresence initial={false} onExitComplete={() => null}>
        {showEditExperienceModal && (
          <ExperienceModal
            setShowExperienceModal={setShowEditExperienceModal}
            showExperienceModal={showEditExperienceModal}
            userProfile={userProfile}
            initialData={editExperienceData}
            isEdit={true}
          />
        )}
        {showAddExperienceModal && (
          <ExperienceModal
            setShowExperienceModal={setShowAddExperienceModal}
            showExperienceModal={showAddExperienceModal}
            userProfile={userProfile}
          />
        )}
        {showDeleteExperienceModal && (
          <DeleteModal
            title="Experience"
            loading={loading}
            onClose={() => setShowDeleteExperienceModal(null)}
            onConfirm={() => handleDeleteExperience()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Experiences;
