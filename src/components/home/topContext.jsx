import { Button } from "@mui/material";
import { IoSearchOutline } from "react-icons/io5";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const TopContent = ({ categories, categoryLoading }) => {
  const navigate = useNavigate();

  // Local state to store jobs and loading
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term
  const [searchResults, setSearchResults] = useState([]); // State to store search results

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Filter categories based on the search term
    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(filteredCategories);
  };

  return (
    <div className="bg-[#111822] h-full w-full min-h-[70vh] relative lg:grid grid-cols-[repeat(2,1fr)] items-center lg:gap-60 text-left overflow-x-hidden py-6 lg:py-0 px-6 lg:px-[19%]  mt-20">
      <div className="">
        <h4 className="text-2xl lg:text-3xl font-semibold text-[white] mb-2.5">
          <i className="signature-font">KocFreelancing,</i> yetenekleri olan
          insanları yeteneğine uygun işlerle kolay ve basit şekilde buluşturan
          bir platformdur.
        </h4>
        <div>
          <div className="inline-flex flex-col justify-center relative text-gray-500">
            <form className="lg:w-[600px] w-[85vw] h-[55px] flex rounded-md bg-white">
              <div className="flex items-center justify-center">
                <IoSearchOutline className=" text-[#777] w-6 h-6 m-2 " />
              </div>

              <input
                type="text"
                placeholder="NE ARIYORSUN?"
                value={searchTerm}
                onChange={handleSearchChange} // Call handleSearchChange on input change
                className="flex-1 outline-none"
              />
              <Button
                className="top-btn"
                onClick={() => {
                  if (searchTerm !== "" && searchResults?.length > 0) {
                    navigate(`/category/${searchResults[0]?._id}`);
                  }
                }}
              >
                Ara
              </Button>
            </form>
            {console.log(searchResults)}
            {searchTerm !== "" && (
              <div className="absolute left-0 w-full top-full z-10">
                <ul className="bg-white border border-gray-100 rounded p-3">
                  {searchResults.length > 0 ? (
                    <div className="search-results">
                      {searchResults.map((item, index) => (
                        <li
                          onClick={() => navigate(`/category/${item?._id}`)}
                          key={index}
                          className=" p-3 border-b hover:bg-gray-100 hover:rounded cursor-pointer"
                        >
                          {item?.name}
                        </li>
                      ))}
                    </div>
                  ) : (
                    <li className=" p-3  hover:bg-gray-100 hover:rounded cursor-pointer">
                      No results found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="text-[white] pt-3 lg:pt-[25px] space-y-2 space-x-2">
          {" "}
          Popüler:{" "}
          {!categoryLoading ? (
            categories.length > 0 ? (
              categories.slice(0, 4).map((item, index) => (
                <Link
                  href={`/category/${item._id}`}
                  key={index}
                  className="inline-block text-[white] border leading-[0.5] text-[11px] font-medium transition-all duration-[0.55s] ease-[ease] p-[11px] rounded-[30px] border-solid border-transparent hover:border hover:translate-x-2 hover:border-solid hover:border-[white] bg-[#2c3f5a]"
                >
                  {item.name}
                </Link>
              ))
            ) : (
              <span>No data to show</span>
            )
          ) : (
            <Link to="#">...</Link>
          )}
        </div>
      </div>
      <div className="hidden lg:block">
        <img
          src="/assets/img/anasayfa3.png"
          alt="anasayfa3.png"
          width={500}
          height={500}
          className="max-h-[500px]  max-w-[500px]"
        />
      </div>
    </div>
  );
};
