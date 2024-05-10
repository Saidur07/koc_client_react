import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  addLanguage,
  addProject,
  editLanguage,
  editProject,
  getProfile,
} from "../../axios/axios";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { useForm } from "react-hook-form";

import axios from "axios";

const ProjectModal = ({
  setShowAddProjectModal,
  showAddProjectModal,
  userProfile,
  initialData,
  isEdit,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {},
  });
  const loading = useSelector((state) => state.loading.loading);
  const [projectData, setProjectData] = useState({
    image: initialData?.image || "",
  });
  const [imageLoading, setImageLoading] = useState(false);
  const handleFileChange = async (event) => {
    setImageLoading(true);
    const file = event.target.files[0];

    if (file?.type?.startsWith("image/")) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          formData
        );
        const imageUrl = response.data.data.url;
        setProjectData({ ...projectData, image: imageUrl });
        console.log("image", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.error("Please select an image file.");
    }
    setImageLoading(false);
  };

  const onSubmit = (data) => {
    if (isEdit) {
      dispatch(setLoading(true));
      dispatch(
        editProject({
          dynamicParams: {
            userId: userProfile?.user?._id,
            projectId: showAddProjectModal,
          },
          bodyData: { ...data, image: projectData.image },
        })
      )
        .then(() => dispatch(getProfile()))
        .then(() => {
          dispatch(setLoading(false));
          setShowAddProjectModal(null);
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    } else {
      dispatch(setLoading(true));
      dispatch(
        addProject({
          dynamicParams: { userId: userProfile?.user?._id },
          bodyData: { ...data, image: projectData.image },
        })
      )
        .then(() => dispatch(getProfile()))
        .then(() => {
          dispatch(setLoading(false));
          setShowAddProjectModal(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    }
  };

  useEffect(() => {
    if (!showAddProjectModal) {
      reset();
    }
  }, [showAddProjectModal]);

  return (
    <Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:p-8 p-4 w-[90vw] rounded-2xl bg-white lg:min-w-[480px] lg:max-w-lg "
      >
        <div className="flex flex-col max-h-[80vh] p-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">
              {isEdit ? "Edit" : "Add"} a project
            </p>
            <RxCross1
              className="text-2xl cursor-pointer"
              onClick={() => setShowAddProjectModal(!isEdit ? false : null)}
            />
          </div>
          <div className="flex flex-col space-y-2 my-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
              <label htmlFor="title" className="col-span-full font-medium">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                {...register("title", { required: true })}
                className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: My Web App"
              />
            </div>
            {errors.title && (
              <span className="w-full text-red-500 -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
              <label htmlFor="link" className="col-span-full font-medium">
                Project Link
              </label>
              <input
                type="url"
                id="link"
                name="link"
                {...register("link", { required: true })}
                className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: https://www.google.com"
              />
            </div>
            {errors.link && (
              <span className="w-full text-red-500 -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}
            <label htmlFor="file" className="col-span-full font-medium">
              Image
              {projectData?.image !== "" && (
                <img
                  src={projectData?.image}
                  width={300}
                  height={400}
                  alt="picture"
                  className="rounded-xl"
                  style={{ objectFit: "cover" }} // Ensure the image covers the specified dimensions
                />
              )}
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              {...(projectData?.image === "" && { required: true })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 pt-3 border-t">
          <button
            type="button"
            className="px-4 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-full"
            onClick={() => setShowAddProjectModal(!isEdit ? false : null)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
              loading || imageLoading || errors.name || errors.efficiency
                ? "cursor-not-allowed py-[18px] opacity-50"
                : "py-3"
            }`}
            disabled={
              loading || imageLoading || errors.name || errors.efficiency
            }
          >
            {loading || imageLoading ? (
              <div className="loaderProfile mx-auto "></div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
