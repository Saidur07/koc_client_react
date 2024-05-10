import React from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { editInfo, getProfile } from "../../axios/axios";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { useForm } from "react-hook-form";

const AddLanguageModal = ({
  setShowEditInfoModal,
  userProfile,
  initialData,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {}, // Set default values from initialData if available
  });
  const loading = useSelector((state) => state.loading.loading);

  const onSubmit = (data) => {
    dispatch(setLoading(true));
    dispatch(
      editInfo({
        dynamicParams: {
          userId: userProfile?.user?._id,
        },
        bodyData: data,
      })
    )
      .then(() => dispatch(getProfile()))
      .then(() => {
        dispatch(setLoading(false));
        setShowEditInfoModal(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        dispatch(setLoading(false));
      });
  };

  return (
    <Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:p-8 p-4 w-[90vw] rounded-2xl bg-white lg:min-w-[480px] lg:max-w-lg "
      >
        <div className="flex flex-col max-h-[80vh] p-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">Edit your info</p>
            <RxCross1
              className="text-2xl cursor-pointer"
              onClick={() => setShowEditInfoModal(null)}
            />
          </div>
          <div className="flex flex-col space-y-2 my-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
              <label htmlFor="sub_title" className="col-span-full font-medium">
                Title
              </label>
              <input
                type="text"
                id="sub_title"
                name="sub_title"
                {...register("sub_title", { required: true })}
                className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: Web Developer"
              />
            </div>
            {errors.sub_title && (
              <span className="w-full text-red-500 -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
              <label
                htmlFor="hourly_rate"
                className="col-span-full font-medium"
              >
                Hourly rate (USD)
              </label>
              <input
                type="number"
                id="hourly_rate"
                name="hourly_rate"
                {...register("hourly_rate", { required: true })}
                className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: 15"
              />
            </div>
            {errors.hourly_rate && (
              <span className="w-full text-red-500 -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}
            <div className="">
              <label
                htmlFor="description"
                className="col-span-full font-medium "
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                {...register("description", { required: true })}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary mt-2"
                placeholder="Enter description"
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
            onClick={() => setShowEditInfoModal(null)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
              loading || errors.sub_title || errors.description
                ? "cursor-not-allowed py-[18px] opacity-50"
                : "py-3"
            }`}
            disabled={loading || errors.sub_title || errors.description}
          >
            {loading ? <div className="loaderProfile mx-auto "></div> : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLanguageModal;
