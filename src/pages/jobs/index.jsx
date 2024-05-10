import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/Navbar";
import ProjectCard from "../components/projectCard/projectCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import JobsModal from "../../components/modals/JobsModal";
import { AnimatePresence } from "framer-motion";
import {
  getBookmarks,
  getMyJobs,
  getJobs,
  getAllJobs,
  getCountries,
  getCategories,
} from "../../axios/axios";
import { setLoading } from "../../redux/reducers/loadingSlice";
import ProtectedRoute from "../../components/layouts/ProtectedRoute";
import Select from "react-tailwindcss-select";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeJobs, setActiveJobs] = useState("bestMatches");
  const loading = useSelector((state) => state.loading.loading);
  const userProfile = useSelector((state) => state.user.data);
  const [searchTerm, setSearchTerm] = useState("");
  const allJobs = useSelector((state) => state.jobs?.allJobs?.data);
  const bestMatches = useSelector((state) => state.jobs?.jobs?.data);
  const bookmarks = useSelector((state) => state.jobs?.bookmarks?.data);
  const myJobs = useSelector((state) => state.jobs?.myJobs?.data);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [projectSize, setProjectSize] = useState("");
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
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
        // Fetch categories data
        const categoriesResponse = await dispatch(getCategories(""));
        setCategoriesOptions(
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
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      if (searchTerm !== "") {
        await dispatch(
          getAllJobs({
            user_id: userProfile?.user?._id,
            searchTerm: searchTerm,
            sortOrder: sortOrder,
            sortBy: sortBy,
            minBudget: minBudget,
            maxBudget: maxBudget,
            project_size: projectSize,
            category:
              !selectedCategory || selectedCategory?.length === 0
                ? ""
                : selectedCategory.map((item) => item.value).join(","),
            country: selectedCountry === "" ? "" : selectedCountry.value,
          })
        );
      } else {
        await dispatch(
          getJobs({
            user_id: userProfile?.user?._id,
            sortOrder: sortOrder,
            sortBy: sortBy,
            minBudget: minBudget,
            maxBudget: maxBudget,
            project_size: projectSize,
            country: selectedCountry === "" ? "" : selectedCountry.value,
          })
        );
        await dispatch(getBookmarks(userProfile?.user?._id));
        await dispatch(getMyJobs(userProfile?.user?._id));
      }
      dispatch(setLoading(false));
    };
    fetchData();
  }, [
    // activeJobs,
    dispatch,
    maxBudget,
    minBudget,
    projectSize,
    searchTerm,
    selectedCategory,
    selectedCountry,
    sortBy,
    sortOrder,
    userProfile,
  ]);

  console.log("jobs", bestMatches, allJobs, loading);

  const [displayedBestMatches, setDisplayedBestMatches] = useState(10);
  const [displayedMyJobs, setDisplayedMyJobs] = useState(10);
  const [displayedBookmarks, setDisplayedBookmarks] = useState(10);
  const [displayedAllJobs, setDisplayedAllJobs] = useState(10);
  const loadMoreJobs = () => {
    if (searchTerm !== "") {
      setDisplayedAllJobs((prev) => prev + 10);
    } else if (activeJobs === "bestMatches") {
      setDisplayedBestMatches((prev) => prev + 10);
    } else if (activeJobs === "myJobs") {
      setDisplayedMyJobs((prev) => prev + 10);
    } else if (activeJobs === "bookmarks") {
      setDisplayedBookmarks((prev) => prev + 10);
    }
  };

  const showLessJobs = () => {
    if (searchTerm !== "") {
      setDisplayedAllJobs(10);
    } else if (activeJobs === "bestMatches") {
      setDisplayedBestMatches(10);
    } else if (activeJobs === "myJobs") {
      setDisplayedMyJobs(10);
    } else if (activeJobs === "bookmarks") {
      setDisplayedBookmarks(10);
    }
  };

  const [showAddJobModal, setShowAddJobModal] = useState(false);
  return (
    <ProtectedRoute>
      <Navbar />
      <div className=" max-w-screen-xl  my-28 mx-4 lg:mx-auto flex flex-col lg:grid grid-cols-4 gap-x-6">
        <div className="col-span-3">
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
              placeholder="Search for jobs"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <button
            className="block lg:hidden rounded-3xl my-3  w-full py-3 bg-primary hover:bg-opacity-90 transition-all border text-white text-center active:scale-95 "
            onClick={() => {
              if (
                userProfile?.description &&
                userProfile?.hourly_rate &&
                userProfile?.sub_title
              ) {
                setShowAddJobModal(true);
              } else {
                toast.error("Please complete your profile first");
                navigate("/profile/me");
              }
            }}
          >
            Post a new job
          </button>
          <div className="flex items-center justify-between mt-4 lg:my-8 ">
            <p className="font-medium text-lg lg:text-2xl">
              Jobs you might like
            </p>
            {!(activeJobs === "myJobs" || activeJobs === "bookmarks") && (
              <div className="lg:block flex flex-col justify-end ">
                {" "}
                <label
                  htmlFor="sort"
                  className="lg:mx-2 lg:text-sm mx-1 font-medium"
                >
                  Sort By
                </label>
                <select
                  id="sort"
                  className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-32 lg:w-48"
                  onChange={(event) => {
                    const selectedOption = event.target.value;
                    if (selectedOption === "Newest") {
                      setSortBy("createdAt");
                      setSortOrder("desc");
                    } else if (selectedOption === "Oldest") {
                      setSortBy("createdAt");
                      setSortOrder("asc");
                    } else if (selectedOption === "Lowest Bids") {
                      setSortBy("proposals");
                      setSortOrder("asc");
                    } else if (selectedOption === "Highest Bids") {
                      setSortBy("proposals");
                      setSortOrder("desc");
                    } else if (selectedOption === "Lowest Price") {
                      setSortBy("budget");
                      setSortOrder("asc");
                    } else if (selectedOption === "Highest Price") {
                      setSortBy("budget");
                      setSortOrder("desc");
                    }
                  }}
                >
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Lowest Bids">Fewest Bids</option>
                  <option value="Highest Bids">Most Bids</option>
                  <option value="Lowest Price">Lowest Price</option>
                  <option value="Highest Price">Highest Price</option>
                </select>
              </div>
            )}
          </div>
          <div className="lg:hidden mb-4 col-span-1">
            <p className="lg:my-8 mt-4 mx-2 lg:mx-0 font-medium text-lg lg:text-2xl">
              Filters
            </p>
            <div className=" w-full  overflow-y-scroll no-scrollbar border  rounded-3xl bg-[#ffffff] overflow-hidden py-3 px-3">
              <div className="my-2 ">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Job Budget (USD)</p>
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
                <div className="flex items-center justify-between gap-3 mt-1">
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
              <div className="my-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Project Size</p>
                  <p
                    className=" text-primary cursor-pointer"
                    onClick={() => setProjectSize("")}
                  >
                    Clear
                  </p>
                </div>
                <select
                  id="size"
                  name="size"
                  className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full "
                  onChange={(e) => setProjectSize(e.target.value)}
                  value={projectSize}
                >
                  <option value="">Select Project size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
              <div className="my-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Client's Country</p>
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
              {searchTerm !== "" && (
                <div className="my-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">Job Category</p>
                    <p
                      className=" text-primary cursor-pointer"
                      onClick={() => setSelectedCategory([])}
                    >
                      Clear
                    </p>
                  </div>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e)}
                    options={categoriesOptions}
                    isSearchable
                    isMultiple
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
              )}
            </div>
          </div>
          <div className="border rounded-3xl max-w-screen-xl  justify-center    lg:mb-14 mx-auto">
            {searchTerm !== "" &&
              (loading ? (
                <div className="rounded-3xl max-w-screen-xl flex items-center justify-center h-full lg:h-[80vh]  lg:mb-14 mx-auto">
                  <div className="loader"></div>
                </div>
              ) : allJobs?.length > 0 ? (
                [...allJobs]
                  .slice(0, displayedAllJobs)
                  .map((item, index) => (
                    <ProjectCard
                      data={item}
                      key={index}
                      length={allJobs?.length}
                      index={index}
                      myJob={false}
                      userProfile={userProfile}
                    />
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
              ))}

            {searchTerm === "" && (
              <div>
                <ul className=" text-secondary font-medium text-center rounded-t-3xl shadow flex  ">
                  <li className="w-full focus-within:z-10">
                    <button
                      className={
                        activeJobs === "bestMatches"
                          ? "inline-block w-full p-4 text-sm lg:text-medium text-gray-900 bg-gray-100 border-r border-gray-200  rounded-tl-3xl active "
                          : "inline-block w-full p-4 text-sm lg:text-medium bg-white border-r border-gray-200  hover:text-gray-700 rounded-tl-3xl hover:bg-gray-50"
                      }
                      onClick={() => setActiveJobs("bestMatches")}
                    >
                      Best matches ({bestMatches?.length ?? 0})
                    </button>
                  </li>
                  <li className="w-full focus-within:z-10">
                    <button
                      className={
                        activeJobs === "bookmarks"
                          ? "inline-block w-full p-4 text-sm lg:text-medium text-gray-900 bg-gray-100 border-r border-gray-200   active "
                          : "inline-block w-full p-4 text-sm lg:text-medium bg-white border-r border-gray-200  hover:text-gray-700  hover:bg-gray-50"
                      }
                      onClick={() => setActiveJobs("bookmarks")}
                    >
                      Bookmarks ({bookmarks?.length ?? 0})
                    </button>
                  </li>
                  <li className="w-full focus-within:z-10">
                    <button
                      className={
                        activeJobs === "myJobs"
                          ? "inline-block w-full p-4 text-sm lg:text-medium text-gray-900 bg-gray-100 border-gray-200  rounded-tr-3xl active "
                          : "inline-block w-full p-4 text-sm lg:text-medium bg-white border-gray-200  hover:text-gray-700 rounded-tr-3xl hover:bg-gray-50"
                      }
                      onClick={() => setActiveJobs("myJobs")}
                    >
                      Your jobs ({myJobs?.length ?? 0})
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {loading ? (
              <div className="rounded-3xl max-w-screen-xl flex items-center justify-center h-[80vh]  mb-14 mx-auto">
                <div className="loader"></div>
              </div>
            ) : searchTerm === "" && activeJobs === "bestMatches" ? (
              bestMatches?.length > 0 ? (
                bestMatches
                  .slice(0, displayedBestMatches)
                  .map((item, index) => (
                    <ProjectCard
                      data={item}
                      key={index}
                      length={bestMatches?.length}
                      index={index}
                      myJob={false}
                      userProfile={userProfile}
                    />
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
              )
            ) : searchTerm === "" && activeJobs === "bookmarks" ? (
              bookmarks?.length > 0 ? (
                [...bookmarks]
                  .reverse()
                  .slice(0, displayedBookmarks)
                  .map((item, index) => (
                    <ProjectCard
                      data={item}
                      key={index}
                      length={bookmarks?.length}
                      index={index}
                      myJob={false}
                      isBookmark={true}
                      userProfile={userProfile}
                    />
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
              )
            ) : searchTerm === "" && activeJobs === "myJobs" ? (
              myJobs?.length > 0 ? (
                [...myJobs]
                  .reverse()
                  .slice(0, displayedMyJobs)
                  .map((item, index) => (
                    <ProjectCard
                      data={item}
                      key={index}
                      length={myJobs?.length}
                      index={index}
                      myJob={true}
                      userProfile={userProfile}
                    />
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
              )
            ) : (
              ""
            )}
            <div
              className={`${
                loading ? "hidden" : "flex"
              } items-center justify-center gap-x-2 `}
            >
              {searchTerm !== "" && allJobs?.length > displayedAllJobs && (
                <div className="flex items-center justify-center my-4">
                  <button
                    className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                    onClick={loadMoreJobs}
                  >
                    Load more jobs
                  </button>
                </div>
              )}

              {searchTerm !== "" && displayedAllJobs > 10 && (
                <div className="flex items-center justify-center my-4">
                  <button
                    className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                    onClick={showLessJobs}
                  >
                    Show less
                  </button>
                </div>
              )}
            </div>
            <div
              className={`${
                loading ? "hidden" : "flex"
              } items-center justify-center gap-x-2 `}
            >
              {searchTerm === "" &&
                activeJobs === "myJobs" &&
                myJobs?.length > displayedMyJobs && (
                  <div className="flex items-center justify-center my-4">
                    <button
                      className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                      onClick={loadMoreJobs}
                    >
                      Load more jobs
                    </button>
                  </div>
                )}

              {searchTerm === "" &&
                activeJobs === "myJobs" &&
                displayedMyJobs > 10 && (
                  <div className="flex items-center justify-center my-4">
                    <button
                      className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                      onClick={showLessJobs}
                    >
                      Show less
                    </button>
                  </div>
                )}
            </div>
            <div
              className={`${
                loading ? "hidden" : "flex"
              } items-center justify-center gap-x-2 `}
            >
              {searchTerm === "" &&
                activeJobs === "bookmarks" &&
                bookmarks?.length > displayedBookmarks && (
                  <div className="flex items-center justify-center my-4">
                    <button
                      className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                      onClick={loadMoreJobs}
                    >
                      Load more
                    </button>
                  </div>
                )}
              {searchTerm === "" &&
                activeJobs === "bookmarks" &&
                displayedBookmarks > 10 && (
                  <div className="flex items-center justify-center my-4">
                    <button
                      className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                      onClick={showLessJobs}
                    >
                      Show less
                    </button>
                  </div>
                )}
            </div>
            <div
              className={`${
                loading ? "hidden" : "flex"
              } items-center justify-center gap-x-2 `}
            >
              {searchTerm === "" &&
                activeJobs === "bestMatches" &&
                bestMatches?.length > displayedBestMatches && (
                  <div className="flex items-center justify-center my-4">
                    <button
                      className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                      onClick={loadMoreJobs}
                    >
                      Load more
                    </button>
                  </div>
                )}
              {searchTerm === "" &&
                activeJobs === "bestMatches" &&
                displayedBestMatches > 10 && (
                  <div className="flex items-center justify-center my-4">
                    <button
                      className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                      onClick={showLessJobs}
                    >
                      Show less
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="lg:block hidden col-span-1">
          <button
            className=" rounded-3xl  w-full py-3 bg-primary hover:bg-opacity-90 transition-all border text-white text-center active:scale-95 "
            onClick={() => {
              if (
                userProfile?.description &&
                userProfile?.hourly_rate &&
                userProfile?.sub_title
              ) {
                setShowAddJobModal(true);
              } else {
                toast.error("Please complete your profile first");
                navigate("/profile/me");
              }
            }}
          >
            Post a new job
          </button>
          <p className="my-8 font-medium  text-2xl">Filters</p>
          <div className=" w-full min-h-[70vh] overflow-y-scroll no-scrollbar border mt-6 rounded-3xl bg-[#ffffff] overflow-hidden py-3 px-6">
            <div className="my-2 ">
              <div className="flex items-center justify-between">
                <p className="font-medium">Job Budget (USD)</p>
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
              <div className="flex items-center justify-between gap-3 mt-1">
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
            <div className="my-2">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium">Project Size</p>
                <p
                  className=" text-primary cursor-pointer"
                  onClick={() => setProjectSize("")}
                >
                  Clear
                </p>
              </div>
              <select
                id="size"
                name="size"
                className="cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full "
                onChange={(e) => setProjectSize(e.target.value)}
                value={projectSize}
              >
                <option value="">Select Project size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div className="my-2">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium">Client's Country</p>
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
            {searchTerm !== "" && (
              <div className="my-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Job Category</p>
                  <p
                    className=" text-primary cursor-pointer"
                    onClick={() => setSelectedCategory([])}
                  >
                    Clear
                  </p>
                </div>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e)}
                  options={categoriesOptions}
                  isSearchable
                  isMultiple
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
            )}
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} onExitComplete={() => null}>
        {showAddJobModal && (
          <JobsModal
            setShowJobsModal={setShowAddJobModal}
            showJobsModal={showAddJobModal}
            userProfile={userProfile}
          />
        )}
      </AnimatePresence>
      <Footer />
    </ProtectedRoute>
  );
};

export default Jobs;
