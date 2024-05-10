import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/Navbar";
import Description from "../../components/ui/Description";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCategories } from "../../axios/axios";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state to store jobs and loading
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Dispatch the getCategories action on component mount
  useEffect(() => {
    // Update local loading state to true when fetching categories
    setCategoryLoading(true);
    dispatch(getCategories(searchTerm))
      .then((response) => {
        // Update local jobs state with fetched data
        setCategories(response.payload?.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        // Update local loading state to false after fetching completes
        setCategoryLoading(false);
      });
  }, [dispatch, searchTerm]);

  // Toggle show more reviews
  const [displayedRemainingReviews, setDisplayedRemainingReviews] =
    useState(12);

  const loadMoreReviews = () => {
    setDisplayedRemainingReviews((prev) => prev + 12);
  };

  const showLessReviews = () => {
    setDisplayedRemainingReviews(12);
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
            placeholder="Search for categories"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <p className="my-8 font-medium text-lg lg:text-2xl ">
          Categories you're looking for ({categories?.length})
        </p>

        <div className=" max-w-screen-xl grid grid-cols-1 lg:grid-cols-3  gap-x-6 gap-y-24 mt-20 mb-14 mx-auto">
          {categoryLoading ? (
            <div className="flex items-center col-span-1 lg:col-span-3 justify-center h-[50vh]  mb-14 mx-auto">
              <div className="loader"></div>
            </div>
          ) : categories?.length > 0 ? (
            [...categories]
              .reverse()
              .slice(0, displayedRemainingReviews)
              .map((item, index) => (
                <div
                  className="relative flex flex-col rounded-xl bg-white border shadow cursor-pointer group transition-all text-secondary "
                  key={index}
                  onClick={() => navigate(`/category/${item?._id}`)}
                >
                  <div className="w-full transition-all  px-6 rounded-xl">
                    {item?.image ? (
                      <img
                        src={item?.image}
                        alt="picture"
                        className="rounded-xl w-full  transition-all -mt-8 h-48 overflow-hidden h-full"
                        style={{
                          objectFit: "cover", // cover, contain, none
                        }}
                      />
                    ) : (
                      <p>No image found</p>
                    )}
                  </div>
                  <div className="p-6 -mt-8">
                    <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                      {item?.name}
                    </h5>
                    <Description
                      description={item?.description}
                      maxLines={5}
                      maxWords={20}
                      className={"block font-sans text-base   "}
                    />
                    <p className="font-medium mt-2">
                      Total Freelancers : {item?.freelancers ?? 0}
                    </p>
                  </div>
                  <div className="p-6 pt-0 mt-auto">
                    <button
                      className=" rounded-3xl  w-full lg:py-3 lg:px-4 px-3 py-2  bg-primary hover:bg-opacity-90 transition-all border text-white text-center active:scale-95 "
                      onClick={() => navigate(`/category/${item?._id}`)}
                    >
                      See details
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
            className={`flex items-center justify-center gap-x-2 lg:col-span-3 `}
          >
            {categories?.length > displayedRemainingReviews && (
              <div className="flex items-center justify-center my-4">
                <button
                  className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                  onClick={loadMoreReviews}
                >
                  Load more
                </button>
              </div>
            )}
            {displayedRemainingReviews > 12 && (
              <div className="flex items-center justify-center my-4">
                <button
                  className="rounded-3xl px-3 py-1 border-primary border text-primary text-center active:scale-95"
                  onClick={showLessReviews}
                >
                  Show less
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
