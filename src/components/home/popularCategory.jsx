import { Container } from "@mui/material";
import Description from "../ui/Description";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const PopularCategory = ({ categories, categoryLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[whitesmoke]">
      <div>
        <h1 className="text-4xl text-[#03446a] text-center w-full mb-[50px] pt-7 lg:pt-[45px]">
          Popüler Kategoriler
        </h1>
      </div>
      <Container>
        <div className=" max-w-screen-xl grid grid-cols-1 lg:grid-cols-3  gap-x-6 gap-y-24 mt-20 mb-14 mx-auto">
          {categoryLoading ? (
            <div className="flex items-center col-span-1 lg:col-span-3 justify-center h-[50vh]  mb-14 mx-auto">
              <div className="loader"></div>
            </div>
          ) : categories?.length > 0 ? (
            [...categories]
              .reverse()
              .slice(0, 12)
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
                src="https://i.ibb.co/mtxszsP/404.png"
                width={400}
                height={400}
                alt="No Data Found"
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center my-8">
          <Link
            className=" rounded-3xl  py-3 px-8    bg-primary hover:bg-opacity-90 transition-all border text-white text-center active:scale-95 "
            to="/categories"
          >
            See all Categories
          </Link>
        </div>
      </Container>
    </div>
  );
};
