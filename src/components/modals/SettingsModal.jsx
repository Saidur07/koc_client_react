import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  editSettings,
  getCategories,
  getCountries,
  getProfile,
} from "../../axios/axios";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { useForm } from "react-hook-form";
import Select from "react-tailwindcss-select";
import { turkishCities } from "../../constants/data";

const SettingsModal = ({
  setShowSettingsModal,
  showSettingsModal,
  initialData,
  isEdit,
  userProfile,
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
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [selectedCity, setSelectedCity] = useState(initialData.city || null);
  const [selectedCategory, setSelectedCategory] = useState(
    initialData.category || null
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        // Fetch categories data
        const categoriesResponse = await dispatch(getCategories(""));
        setCategoryOptions(
          categoriesResponse?.payload?.data?.map((item) => ({
            value: item._id,
            label: item.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      dispatch(setLoading(false));
    };

    fetchData();
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(setLoading(true));
    dispatch(
      editSettings({
        dynamicParams: { userId: userProfile?.user?._id },
        bodyData: {
          user: { first_name: data.first_name, lastName: data.lastName },
          profile: {
            city: selectedCity.value,
            category: selectedCategory.value,
          },
        },
      })
    )
      .then(() => dispatch(getProfile()))
      .then(() => {
        dispatch(setLoading(false));
        setShowSettingsModal(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    if (!showSettingsModal) {
      reset();
    }
  }, [showSettingsModal]);
  return (
    <Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:p-8 p-4 w-[90vw]  rounded-2xl bg-white lg:min-w-[480px] lg:max-w-lg"
      >
        <div className="flex flex-col max-h-[80vh] p-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">Settings</p>
            <RxCross1
              className="text-2xl cursor-pointer"
              onClick={() => setShowSettingsModal(!isEdit ? false : null)}
            />
          </div>
          <div className="flex flex-col space-y-2 my-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
              <label htmlFor="first_name" className="col-span-full font-medium">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                {...register("first_name", { required: true })}
                className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: English"
              />
            </div>
            {errors.first_name && (
              <span className="w-full text-red-500 -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
              <label htmlFor="lastName" className="col-span-full font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                {...register("lastName", { required: true })}
                className="col-span-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: English"
              />
            </div>
            {errors.lastName && (
              <span className="w-full text-red-500 -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}

            <div className="">
              <label htmlFor="category" className="col-span-full font-medium ">
                Category
              </label>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e)}
                options={categoryOptions}
                isSearchable
                loading={loading}
                primaryColor={"lime"}
                placeholder="Select Category"
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
              />
            </div>
            {errors.category && (
              <span className="w-full text-red-500  -mt-1 cursor-context-menu">
                This field is required
              </span>
            )}

            <div className="">
              <label htmlFor="city" className="col-span-full font-medium ">
                Province
              </label>
              <div className="relative">
                <Select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e)}
                  options={turkishCities}
                  isSearchable
                  loading={loading}
                  primaryColor={"lime"}
                  placeholder="Select City"
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
                />
              </div>
            </div>
            {selectedCity === "" && (
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
            onClick={() => setShowSettingsModal(!isEdit ? false : null)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
              loading ||
              errors.first_name ||
              errors.lastName ||
              errors.country ||
              selectedCity === ""
                ? "cursor-not-allowed py-[18px] opacity-50"
                : "py-3"
            }`}
            disabled={
              loading ||
              errors.first_name ||
              errors.lastName ||
              errors.country ||
              selectedCity === ""
            }
          >
            {loading ? <div className="loaderProfile mx-auto "></div> : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
