import { AdvertContent } from "../components/home/advertContent";
import { Benefit } from "../components/home/benefit";
import { FindWork } from "../components/home/findWork";
import { PopularCategory } from "../components/home/popularCategory";
import { Projects } from "../components/home/projects";
import { Steps } from "../components/home/steps";
import { TopContent } from "../components/home/topContext";
import Mainlayout from "../components/layouts/Mainlayout";
import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getPopularCategories } from "../axios/axios";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";

const Home = () => {
  const dispatch = useDispatch();
  // Local state to store jobs and loading
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Dispatch the getCategories action on component mount
  useEffect(() => {
    // Update local loading state to true when fetching categories
    setCategoryLoading(true);
    dispatch(getPopularCategories())
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
  }, [dispatch]);
  return (
    <div>
      <Navbar />
      <Stack>
        <TopContent categories={categories} categoryLoading={categoryLoading} />
        <AdvertContent />
        <PopularCategory
          categories={categories}
          categoryLoading={categoryLoading}
        />
        <Projects />
        <Steps />
        <Benefit />
        <FindWork />
      </Stack>
      <Footer />
    </div>
  );
};

export default Home;
Home.getLayout = function getLayout(page) {
  return <Mainlayout>{page}</Mainlayout>;
};
