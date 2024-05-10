import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  addJob,
  editJob,
  getBookmarks,
  getCategories,
  getJobs,
  getMyJobs,
  getProfile,
  getSkills,
  hireNow,
} from "../../axios/axios";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { useForm } from "react-hook-form";
import Select from "react-tailwindcss-select";
import { useNavigate } from "react-router-dom";

const JobsModal = ({
  setShowJobsModal,
  showJobsModal,
  userProfile,
  initialData,
  isEdit,
  isDetail,
  isHireNow,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {}, // Set default values from initialData if available
  });
  const loading = useSelector((state) => state.loading.loading);
  console.log(loading, "l");
  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (isEdit) {
      dispatch(setLoading(true));
      dispatch(
        editJob({
          dynamicParams: {
            userId: userProfile?.user?._id,
            jobId: showJobsModal,
          },
          bodyData: data,
        })
      )
        .then(() => {
          if (isDetail) {
            window.location.reload();
          } else {
            dispatch(getJobs({ user_id: userProfile?.user?._id, search: "" }));
            dispatch(getBookmarks(userProfile?.user?._id));
            dispatch(getMyJobs(userProfile?.user?._id));
          }
        })
        .then(() => {
          dispatch(setLoading(false));
          setShowJobsModal(null);
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    } else if (isHireNow) {
      dispatch(setLoading(true));
      dispatch(
        hireNow({
          dynamicParams: { id: showJobsModal },
          bodyData: {
            ...data,
            user: userProfile?.user?._id,
            skills: skills?.map((skill) => skill.value),
            category: selectedCategory,
          },
        })
      )
        .then(() => {
          dispatch(setLoading(false));
          setShowJobsModal(null);
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    } else {
      dispatch(setLoading(true));
      dispatch(
        addJob({
          dynamicParams: {},
          bodyData: {
            ...data,
            user: userProfile?.user?._id,
            skills: skills?.map((skill) => skill.value),
            category: selectedCategory,
          },
        })
      )
        .then(() => {
          dispatch(getJobs({ user_id: userProfile?.user?._id }));
          dispatch(getBookmarks(userProfile?.user?._id));
          dispatch(getMyJobs(userProfile?.user?._id));
        })
        .then(() => {
          dispatch(setLoading(false));
          setShowJobsModal(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    }
  };

  useEffect(() => {
    if (!showJobsModal) {
      reset(); // Reset form when modal is closed
    }
  }, [showJobsModal]);
  const [skills, setSkills] = useState(
    initialData
      ? initialData?.skills?.map((skill) => ({
          value: skill._id,
          label: skill.name,
        }))
      : []
  );

  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    initialData ? initialData?.category : ""
  );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Skills data
        const skillsResponse = await dispatch(getSkills());
        const modifiedSkills = skillsResponse?.payload?.data.map((skill) => ({
          value: skill._id,
          label: skill.name,
        }));
        setOptions(modifiedSkills);

        // Fetch categories data
        const categoriesResponse = await dispatch(getCategories(""));
        setCategories(categoriesResponse?.payload?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);
  return (
    <Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:p-8 p-4 w-[90vw] rounded-2xl bg-white lg:min-w-[680px] lg:max-w-lg "
      >
        <div className="flex flex-col max-h-[80vh] p-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">
              {isEdit ? "Edit" : isHireNow ? "Hire For Your" : "Post a new"} Job
            </p>
            <RxCross1
              className="text-2xl cursor-pointer"
              onClick={() =>
                setShowJobsModal(!isEdit || !isHireNow ? false : null)
              }
            />
          </div>
          <div className="flex flex-col space-y-2 my-4">
            {/* title Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <label htmlFor="title" className="col-span-full font-medium">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title", { required: true })}
                className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter job title"
              />
              {errors.title && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              {/* Input fields for budget and deadline */}
              <div className="w-1/2">
                <label htmlFor="budget" className=" font-medium">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  {...register("budget", { required: true })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter budget"
                />
                {errors.budget && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              <div className="w-1/2">
                <label htmlFor="deadline" className=" font-medium">
                  Project Duration (Days)
                </label>
                <input
                  type="number"
                  id="deadline"
                  name="deadline"
                  {...register("deadline", { required: true })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter timeline"
                />
                {errors.deadline && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
            </div>
            {errors.name && (
              <span className="w-full text-red-500 -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}
            <div className="">
              <label
                htmlFor="project_size"
                className="col-span-full font-medium "
              >
                Project size
              </label>
              <select
                id="project_size"
                name="project_size"
                {...register("project_size", { required: true })}
                className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full "
              >
                <option value="">Select Project size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            {errors.project_size && (
              <span className="w-full text-red-500  -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}
            <div className="">
              <label htmlFor="category" className="col-span-full font-medium ">
                Project Category
              </label>
              <select
                id="category"
                name="category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory}
                className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full "
              >
                <option value="">Select Project Category</option>
                {categories?.map((item, index) => (
                  <option key={index} value={item?._id}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-h-[50px] mt-4">
              <label className=" font-medium">Required Skills</label>
              <Select
                value={skills}
                onChange={(e) => setSkills(e)}
                options={options}
                isSearchable
                isMultiple
                loading={loading}
                primaryColor={"lime"}
                classNames={{
                  menuButton: ({ isDisabled }) =>
                    `flex rounded-lg text-black border border-gray-300 p-[2px] shadow-sm transition-all duration-300 focus:outline-none ${
                      isDisabled
                        ? "bg-gray-100"
                        : "bg-white hover:border-gray-400 focus:border-primary focus:ring focus:ring-primary/10"
                    }`,
                  menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-2 mt-1.5 rounded-lg text-gray-700",
                  listItem: ({ isSelected }) =>
                    `block transition duration-200 p-2 rounded-lg cursor-pointer select-none truncate rounded ${
                      isSelected
                        ? `text-white bg-primary`
                        : `text-black hover:bg-green-100 hover:text-primary`
                    }`,
                }}
                placeholder="Select Skills"
              />
            </div>
            <div>
              {/* Input field for job_description */}
              <h3 className="font-medium">Job Description</h3>
              <div className="mt-2">
                <textarea
                  id="job_description"
                  rows={3}
                  {...register("job_description", { required: true })}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter Job Description"
                />
              </div>
            </div>
            {errors.job_description && (
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
            onClick={() =>
              setShowJobsModal(!isEdit || !isHireNow ? false : null)
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
              loading || !selectedCategory || !skills || skills?.length === 0
                ? "cursor-not-allowed py-[18px] opacity-50"
                : "py-3"
            }`}
            disabled={
              loading || !selectedCategory || !skills || skills?.length === 0
            }
          >
            {loading ? (
              <div className="loaderProfile mx-auto "></div>
            ) : isHireNow ? (
              "Hire"
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JobsModal;
