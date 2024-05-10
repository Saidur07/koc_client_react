import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  addLanguage,
  editLanguage,
  getClients,
  getHires,
  getProfile,
  giveClientReview,
  markAsCompleted,
} from "../../axios/axios";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { useForm } from "react-hook-form";
import { Rating, StickerStar } from "@smastrom/react-rating";

const RatingsModal = ({
  setShowRatingsModal,
  showRatingsModal,
  userProfile,
  isForClient,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const loading = useSelector((state) => state.loading.loading);

  const onSubmit = (data) => {
    if (isForClient) {
      dispatch(setLoading(true));
      dispatch(
        giveClientReview({
          dynamicParams: {
            userId: userProfile?.user?._id,
            jobId: showRatingsModal,
          },
          bodyData: { ...data, rating },
        })
      )
        .then(() =>
          dispatch(
            getClients({
              userId: userProfile.user._id,
              search: "",
              status: "",
            })
          )
        )
        .then(() => {
          dispatch(setLoading(false));
          setShowRatingsModal(null);
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    } else {
      dispatch(setLoading(true));
      dispatch(
        markAsCompleted({
          dynamicParams: {
            userId: userProfile?.user?._id,
            jobId: showRatingsModal,
          },
          bodyData: { ...data, rating },
        })
      )
        .then(() =>
          dispatch(
            getHires({
              userId: userProfile.user._id,
              search: "",
              status: "",
            })
          )
        )
        .then(() => {
          dispatch(setLoading(false));
          setShowRatingsModal(null);
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    }
  };

  useEffect(() => {
    if (!showRatingsModal) {
      reset(); // Reset form when modal is closed
    }
  }, [showRatingsModal]);
  const [rating, setRating] = useState(0);
  return (
    <Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:p-8 p-4 w-[90vw] rounded-2xl bg-white lg:min-w-[480px] lg:max-w-lg "
      >
        <div className="flex flex-col max-h-[80vh] p-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">Give feedback</p>
            <RxCross1
              className="text-2xl cursor-pointer"
              onClick={() => setShowRatingsModal(null)}
            />
          </div>
          <div className="flex flex-col space-y-2 my-4">
            <label htmlFor="name" className="col-span-full font-medium">
              Rating
            </label>
            <div className="items-center flex">
              <Rating
                style={{ maxWidth: 200 }}
                value={rating}
                onChange={setRating}
                itemStyles={{
                  itemShapes: StickerStar,
                  activeFillColor: "#35B900",
                  inactiveFillColor: "#cecece",
                }}
              />
              <p className="text-xl mx-2 font-medium">{rating.toFixed(2)}</p>
            </div>
            {rating === 0 && (
              <span className="w-full text-red-500  -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}
            <div className="">
              <label
                htmlFor="description"
                className="col-span-full font-medium "
              >
                Review
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                {...register("description", { required: true })}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary mt-2"
                placeholder="Enter your feedback"
              ></textarea>
            </div>
            {errors.description && (
              <span className="w-full text-red-500  -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 pt-3 border-t">
          <button
            type="button"
            className="px-4 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-full"
            onClick={() => setShowRatingsModal(null)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
              loading || errors.description || rating === 0
                ? "cursor-not-allowed py-[18px] opacity-50"
                : "py-3"
            }`}
            disabled={loading || errors.description || rating === 0}
          >
            {loading ? <div className="loaderProfile mx-auto "></div> : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RatingsModal;
