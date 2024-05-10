import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { addEducation, editEducation, getProfile } from "../../axios/axios";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

const EducationModal = ({
  setShowEducationModal,
  showEducationModal,
  userProfile,
  initialData,
  isEdit,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {}, // Set default values from initialData if available
  });

  const [dateError, setDateError] = useState(false);

  const current = watch("current");
  const loading = useSelector((state) => state.loading.loading);

  useEffect(() => {
    if (!showEducationModal) {
      resetFormData();
    }
  }, [showEducationModal]);

  const resetFormData = () => {
    reset();
  };

  const handleSaveExperience = (data) => {
    const {
      school,
      degree,
      field_of_study,
      fromMonth,
      fromYear,
      toMonth,
      toYear,
      current,
      description,
    } = data;

    const fromDate = new Date(`${fromYear}-${fromMonth}-01`);
    const toDate = current ? null : new Date(`${toYear}-${toMonth}-01`);

    if (toDate && fromDate > toDate) {
      setDateError(true);
      return;
    }

    const formattedData = {
      school,
      degree,
      field_of_study,
      from: format(fromDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      to: toDate ? format(toDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null,
      current,
      description,
    };

    if (isEdit) {
      // If initial data is available, call editEducation instead of addEducation
      dispatch(setLoading(true));
      dispatch(
        editEducation({
          dynamicParams: {
            userId: userProfile?.user?._id,
            educationId: showEducationModal,
          },
          bodyData: formattedData,
        })
      )
        .then(() => dispatch(getProfile()))
        .then(() => {
          dispatch(setLoading(false));
          setShowEducationModal(null);
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    } else {
      dispatch(setLoading(true));
      dispatch(
        addEducation({
          dynamicParams: { userId: userProfile?.user?._id },
          bodyData: formattedData,
        })
      )
        .then(() => dispatch(getProfile()))
        .then(() => {
          dispatch(setLoading(false));
          setShowEducationModal(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setLoading(false));
        });
    }
  };

  // Function to generate options for months
  const renderMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return (
        <option key={month} value={month}>
          {new Date(0, i).toLocaleString("default", { month: "long" })}
        </option>
      );
    });
  };

  // Function to generate options for years from 1970 to current year
  const renderYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1970; year--) {
      years.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
    return years;
  };

  return (
    <Modal>
      <div className="lg:p-8 p-4 w-[90vw] rounded-2xl bg-white lg:min-w-[768px] lg:max-w-lg relative">
        <div className="flex flex-col max-h-[80vh] p-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">Add education</p>
            <RxCross1
              className="text-2xl cursor-pointer"
              onClick={() => setShowEducationModal(!isEdit ? false : null)}
            />
          </div>
          <form onSubmit={handleSubmit(handleSaveExperience)}>
            <div className="flex flex-col space-y-4 my-4">
              {/* School Input */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <label htmlFor="school" className="col-span-full font-medium">
                  School
                </label>
                <input
                  type="text"
                  id="school"
                  {...register("school", { required: true })}
                  className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ex: Oxford University"
                />
                {errors.school && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              {/* Field of Study Input */}
              <div className="flex items-center justify-between gap-3">
                <div className="w-full">
                  <label htmlFor="field_of_study" className="font-medium">
                    Field of study (Optional)
                  </label>
                  <input
                    type="text"
                    id="field_of_study"
                    {...register("field_of_study")}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ex. Computer Science"
                  />
                </div>
              </div>
              {/* Degree Input */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <label htmlFor="degree" className="col-span-full font-medium">
                  Degree (Optional)
                </label>
                <input
                  type="text"
                  id="degree"
                  {...register("degree")}
                  className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ex: Software Engineer"
                />
              </div>
              {/* From Month and From Year Inputs */}
              <div className="flex items-center justify-between gap-3">
                <div className="w-1/2">
                  <label htmlFor="fromMonth" className="font-medium">
                    From Month
                  </label>
                  <select
                    id="fromMonth"
                    {...register("fromMonth", { required: true })}
                    className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
                  >
                    <option value="">Select Month</option>
                    {renderMonthOptions()}
                  </select>
                  {errors.fromMonth && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="w-1/2">
                  <label htmlFor="fromYear" className="font-medium">
                    From Year
                  </label>
                  <select
                    id="fromYear"
                    {...register("fromYear", { required: true })}
                    className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
                  >
                    <option value="">Select Year</option>
                    {renderYearOptions()}
                  </select>
                  {errors.fromYear && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>
              {/* To Month and To Year Inputs */}
              {!current && (
                <div className="flex items-center justify-between gap-3">
                  <div className="w-1/2">
                    <label htmlFor="toMonth" className="font-medium">
                      To Month
                    </label>
                    <select
                      id="toMonth"
                      {...register("toMonth", { required: !current })}
                      className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
                    >
                      <option value="">Select Month</option>
                      {renderMonthOptions()}
                    </select>
                    {errors.toMonth && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="toYear" className="font-medium">
                      To Year
                    </label>
                    <select
                      id="toYear"
                      {...register("toYear", { required: !current })}
                      className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
                    >
                      <option value="">Select Year</option>
                      {renderYearOptions()}
                    </select>
                    {errors.toYear && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                </div>
              )}
              {/* Checkbox for current study */}
              <div className="flex items-center">
                <div className="inline-flex items-center">
                  <label
                    className="relative flex cursor-pointer items-center rounded-full p-2"
                    htmlFor="checkbox-1"
                    data-ripple-dark="true"
                  >
                    <input
                      type="checkbox"
                      id="checkbox-1"
                      {...register("current")}
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-primary transition-all before:absolute checked:border-primary checked:bg-primary"
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
                </div>
                <p className="text-lg text-secondary">I currently study here</p>
              </div>
              {/* Description Textarea */}
              <div>
                <h3 className="font-medium">Description (Optional)</h3>
                <div className="mt-2">
                  <textarea
                    id="description"
                    rows={3}
                    {...register("description")}
                    className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>
            {/* Error message for date */}
            {dateError && (
              <p className="text-red-500">
                Ending date cannot be earlier than starting date.
              </p>
            )}
            {/* Buttons */}
            <div className="flex items-center justify-between space-x-2 pt-3 border-t">
              <button
                type="button"
                className="px-4 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-full"
                onClick={() => setShowEducationModal(!isEdit ? false : null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
                  loading ||
                  errors.school ||
                  errors.fromMonth ||
                  errors.fromYear
                    ? "cursor-not-allowed py-[18px] opacity-50"
                    : "py-3"
                }`}
                disabled={
                  loading ||
                  errors.school ||
                  errors.fromMonth ||
                  errors.fromYear
                }
              >
                {loading ? (
                  <div className="loaderProfile mx-auto "></div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EducationModal;
