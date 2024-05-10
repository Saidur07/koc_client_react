import { getJobById } from "../axios/axios";
import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlArrowLeftCircle } from "react-icons/sl";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaStar } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import { Rating, StickerStar } from "@smastrom/react-rating";
import { getCategoriesById, getCountries } from "../../axios/axios";
import Description from "../../components/ui/Description";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { AnimatePresence } from "framer-motion";
import JobsModal from "../../components/modals/JobsModal";
import Select from "react-tailwindcss-select";

import { formatDistance } from "date-fns";
import toast from "react-hot-toast";

const Category = () => {
  // Next.js router
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  // Component state
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.data);
  const [searchTerm, setSearchTerm] = useState("");
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [rating, setRating] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const loading = useSelector((state) => state.loading.loading);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        // Fetch countries data
        const countriesResponse = await dispatch(getCountries());
        setCountriesOptions(
          countriesResponse?.payload?.data?.map((item) => ({
            value: item.name,
            label: item.name ?? "",
            cities: item.cities,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      dispatch(setLoading(false));
    };

    fetchData();
  }, [dispatch]);
  // Fetch profile data by ID
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories data
        const categoriesResponse = await dispatch(
          getCategoriesById({
            id,
            search: searchTerm,
            country: selectedCountry,
            overall_rating: rating,
          })
        );
        setData(categoriesResponse?.payload?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, id, rating, searchTerm, selectedCountry]);

  const [showHireNowModal, setShowHireNowModal] = useState(null);

  // Toggle show more Data
  const [displayedRemainingData, setDisplayedRemainingData] = useState(12);

  const loadMoreData = () => {
    setDisplayedRemainingData((prev) => prev + 12);
  };

  const showLessData = () => {
    setDisplayedRemainingData(12);
  };
  return (
    <div>
      <Navbar />
      <div className=" max-w-screen-xl  my-28 mx-4 lg:mx-auto  gap-x-6">
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
            placeholder="Search for freelancers"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {!isLoading && (
          <p className="my-8 font-medium text-lg lg:text-2xl">
            Best freelancers of {data?.name} (
            {
              data?.freelancers?.filter(
                (item) => item?.user?._id !== userProfile?.user?._id
              )?.length
            }
            )
          </p>
        )}
        <div className="max-w-screen-xl  my-6 mx-auto flex flex-col-reverse  lg:grid grid-cols-4 gap-x-6">
          <div className="col-span-3">
            <div className="  grid grid-cols-1  gap-6   mx-auto">
              {isLoading ? (
                <div className="flex items-center col-span-1 justify-center h-[50vh]  mb-14 mx-auto">
                  <div className="loader"></div>
                </div>
              ) : data?.freelancers?.length > 0 ? (
                [...data?.freelancers]
                  .reverse()
                  .filter((item) => item?.user?._id !== userProfile?.user?._id)
                  .slice(0, displayedRemainingData)
                  .map((item, index) => (
                    <div
                      className="relative flex flex-col rounded-xl bg-white border shadow cursor-pointer group transition-all text-secondary p-6 lg:my-0 my-4"
                      key={index}
                      onClick={() => navigate(`/profile/${item?.user?._id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className=""
                          onClick={() => navigate(`/profile/me`)}
                        >
                          <div className="lg:flex items-center gap-x-2 cursor-pointer group">
                            {item?.user?.profile_picture ? (
                              <div className="w-[78px] h-[78px] border rounded-full  relative">
                                <img
                                  src={item?.user?.profile_picture}
                                  width={78}
                                  height={78}
                                  alt="profile picture"
                                  className="object-cover rounded-full w-full h-full"
                                />
                              </div>
                            ) : (
                              <div className="w-[78px] h-[78px] border bg-primary flex items-center justify-center rounded-full hover:cursor-pointer relative">
                                <p className="text-2xl text-white">
                                  {(item?.user?.first_name?.slice(0, 1) ?? "") +
                                    (item?.user?.lastName?.slice(0, 1) ?? "")}
                                </p>
                              </div>
                            )}

                            <div>
                              <p className="text-xl text-secondary font-semibold group-hover:text-primary transition-all my-2 lg:my-0">
                                {item?.user?.first_name +
                                  " " +
                                  item?.user?.lastName}{" "}
                              </p>

                              <div className="lg:flex space-y-2 lg:space-y-0 items-center gap-x-2">
                                <div className=" text-secondary flex items-center gap-x-2 font-medium">
                                  <Rating
                                    style={{ maxWidth: 100 }}
                                    value={item?.overall_rating}
                                    readOnly
                                    itemStyles={{
                                      itemShapes: StickerStar,
                                      activeFillColor: "#35B900",
                                      inactiveFillColor: "#cecece",
                                    }}
                                  />

                                  <p className="font-medium  text-secondary">
                                    {" "}
                                    {item?.overall_rating?.toFixed(2)}
                                  </p>
                                  <p>({item?.completed_projects} reviews)</p>
                                </div>
                                <p className="flex items-center ">
                                  <MdOutlineLocationOn className="w-6 h-6 mr-1 -ml-1 text-secondary" />
                                  <span className="text-lg text-secondary">
                                    {item?.city}, {item?.country}
                                  </span>
                                </p>
                              </div>
                              <p className="text-secondary font-medium ">
                                {item?.category?.name} | {item?.sub_title}
                              </p>
                            </div>
                          </div>
                          <div className="my-4">
                            <p className="text-secondary">
                              <Description
                                description={
                                  item?.description ? item?.description : ""
                                }
                                maxLines={1}
                                className="text-secondary break-all"
                              />
                            </p>

                            <p className=" text-secondary mt-2">
                              Joined{" "}
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
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end w-full lg:w-1/2 gap-x-2 pt-0 mt-auto">
                        <button className="rounded-3xl w-full py-3 px-4 bg-white border-primary hover:bg-opacity-90 transition-all border text-primary text-center active:scale-95">
                          View profile
                        </button>
                        <button
                          className="rounded-3xl w-full py-3 px-4 bg-primary hover:bg-opacity-90 transition-all border text-white text-center active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (userProfile) {
                              if (
                                userProfile?.description &&
                                userProfile?.hourly_rate &&
                                userProfile?.sub_title
                              ) {
                                setShowHireNowModal(item?.user?._id);
                              } else {
                                toast.error(
                                  "Please complete your profile first"
                                );
                                navigate("/profile/me");
                              }
                            } else {
                              navigate("/auth/login");
                            }
                          }}
                        >
                          Hire now
                        </button>
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
                className={`flex items-center justify-center gap-x-2 col-span-1 `}
              >
                {data?.freelancers?.length > displayedRemainingData && (
                  <div className="flex items-center justify-center my-4">
                    <button
                      className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                      onClick={loadMoreData}
                    >
                      Load more
                    </button>
                  </div>
                )}
                {displayedRemainingData > 12 && (
                  <div className="flex items-center justify-center my-4">
                    <button
                      className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                      onClick={showLessData}
                    >
                      Show less
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className=" w-full min-h-[50vh] overflow-y-scroll no-scrollbar border rounded-3xl bg-[#ffffff] overflow-hidden py-3 px-6">
              <p className=" font-medium mb-6 text-2xl">Filters</p>
              <div className="my-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Rating</p>
                  <p
                    className=" text-primary cursor-pointer"
                    onClick={() => setRating("")}
                  >
                    Clear
                  </p>
                </div>
                <div className="items-center flex">
                  <Rating
                    style={{ maxWidth: 100 }}
                    value={rating}
                    onChange={setRating}
                    itemStyles={{
                      itemShapes: StickerStar,
                      activeFillColor: "#35B900",
                      inactiveFillColor: "#cecece",
                    }}
                  />
                </div>
              </div>
              <div className="my-3 ">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Hourly rate (USD)</p>
                  <p
                    className=" text-primary cursor-pointer"
                    onClick={() => {
                      setMinBudget("");
                      setMaxBudget("");
                    }}
                  >
                    Clear
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 mt-2">
                  <div className="w-1/2">
                    <label htmlFor="minBudget" className="font-medium">
                      min
                    </label>
                    <input
                      type="number"
                      id="minBudget"
                      name="minBudget"
                      className="p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      placeholder="Ex. 20"
                      onChange={(e) => setMinBudget(e.target.value)}
                      value={minBudget}
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="maxBudget" className="font-medium">
                      max
                    </label>
                    <input
                      type="number"
                      id="maxBudget"
                      name="maxBudget"
                      className="p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      placeholder="Ex. 200"
                      onChange={(e) => setMaxBudget(e.target.value)}
                      value={maxBudget}
                    />
                  </div>
                </div>
              </div>
              <div className="my-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Freelancer's Country</p>
                  <p
                    className=" text-primary cursor-pointer"
                    onClick={() => setSelectedCountry("")}
                  >
                    Clear
                  </p>
                </div>
                <Select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e)}
                  options={countriesOptions}
                  isSearchable
                  loading={loading}
                  primaryColor={"lime"}
                  placeholder="Select Country"
                  classNames={{
                    menuButton: ({ isDisabled }) =>
                      `flex rounded-lg text-black border border-gray-300 p-[1px] shadow-sm transition-all duration-300 focus:outline-none ${
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
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} onExitComplete={() => null}>
        {showHireNowModal && (
          <JobsModal
            setShowJobsModal={setShowHireNowModal}
            showJobsModal={showHireNowModal}
            userProfile={userProfile}
            isHireNow={true}
          />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Category;
