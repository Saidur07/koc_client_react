import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompletionPercentage } from "../../redux/reducers/userSlice";

const ProfileCompletion = ({ userProfile }) => {
  const [completionPercentage, setCompletionPercentageState] = useState(0);
  const dispatch = useDispatch();
  const percentage = useSelector((state) => state.user?.completionPercentage);
  // Define weights for each criterion
  const weights = {
    education: 3,
    experience: 3,
    languages: 2,
    payment_verified: 2,
    phone_verified: 2,
    projects: 4,
    skills: 4,
    title: 2,
    hourly_rate: 2,
    description: 3,
    profile_picture: 1,
  };

  // Calculate completion percentage based on fulfilled criteria
  const calculateCompletionPercentage = (profile, weights) => {
    let totalWeight = 0;
    let fulfilledWeight = 0;

    // Iterate through the profile fields and calculate fulfillment
    for (const criterion in weights) {
      if (
        criterion === "languages" ||
        criterion === "education" ||
        criterion === "skills" ||
        criterion === "projects" ||
        criterion === "experience"
      ) {
        // For array fields, check if the field exists and has a length greater than zero
        if (profile[criterion] && profile[criterion].length > 0) {
          fulfilledWeight += weights[criterion];
        }
      } else {
        // For non-array fields, check if they exist and are not undefined
        if (profile[criterion] !== undefined) {
          fulfilledWeight += weights[criterion];
        }
      }
      totalWeight += weights[criterion];
    }

    // Calculate completion percentage
    const percentage = Math.round((fulfilledWeight / totalWeight) * 100);
    // Dispatch action to update completion percentage in the store
    dispatch(setCompletionPercentage(percentage));
    return percentage; // Return the percentage
  };

  useEffect(() => {
    // Calculate completion percentage when userProfile changes
    if (userProfile) {
      const percentage = calculateCompletionPercentage(userProfile, weights);
      setCompletionPercentageState(percentage);
    }
  }, [userProfile, weights, dispatch]); // Listen for changes in userProfile and weights

  console.log(completionPercentage);
  return (
    <div className="bg-red-100 p-3 rounded-t-3xl flex justify-between items-center">
      <p className="text-lg ">Please Complete Your Profile</p>
      <div className="relative size-12">
        <svg
          className="size-full"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-primary "
            strokeWidth="2"
          ></circle>
          <g className="origin-center -rotate-90 transform">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-current text-red-300 -500"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset={percentage}
            ></circle>
          </g>
        </svg>
        <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <span className="text-center text-sm font-bold text-gray-700 ">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
