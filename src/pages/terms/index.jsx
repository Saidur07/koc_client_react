import React, { useEffect, useState } from "react";
import Navbar from "../../components/layouts/Navbar";
import Footer from "../../components/layouts/Footer";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { getTerms } from "../../axios/axios";
import { useDispatch, useSelector } from "react-redux";

import { formatDistance } from "date-fns";

const Terms = () => {
  const loading = useSelector((state) => state.loading?.loading);
  const [terms, setTerms] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        // Fetch countries data
        const response = await dispatch(getTerms());
        setTerms(response.payload.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      dispatch(setLoading(false));
    };

    fetchData();
  }, [dispatch]);
  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="border rounded-3xl max-w-screen-xl flex items-center justify-center h-[80vh] my-28  mx-auto">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="mt-28 mx-2 lg:mx-auto max-w-screen-xl">
          <div className="border rounded-3xl w-full my-6 p-6 ">
            <p className="text-3xl font-medium">Terms and Conditions</p>
            <p className=" leading-normal font-medium text-secondary mb-4 mt-2">
              {terms?.[0]?.updatedAt &&
                (({ timestamp }) => (
                  <span>
                    Last updated{" "}
                    {formatDistance(new Date(timestamp), new Date(), {
                      addSuffix: true,
                    })}
                  </span>
                ))({ timestamp: terms?.[0]?.updatedAt ?? 0 })}
            </p>
            <p className="text-secondary">
              {terms?.[0]?.content ?? (
                <div className="flex items-center justify-center">
                  <img
                    src="/assets/404.png"
                    width={400}
                    height={400}
                    alt="No Data Found"
                  />
                </div>
              )}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Terms;
