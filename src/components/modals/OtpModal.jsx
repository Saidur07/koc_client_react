import React, { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { addLanguage, editLanguage, getProfile } from "../../axios/axios";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { useForm } from "react-hook-form";

const OtpModal = ({ setOtpModal, userProfile, otpModal }) => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.loading.loading);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  console.log(otp, inputs);
  const handleChange = (e, index) => {
    const { value } = e.target;
    // Allow only numeric characters
    const numericValue = value.replace(/\D/g, "");
    const newOTP = [...otp];
    newOTP[index] = numericValue.slice(-1); // Update OTP array
    setOtp(newOTP);
    // Move focus to the next input
    if (value !== "" && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (!otpModal) {
      setOtp(["", "", "", "", "", ""]); // Reset form when modal is closed
    }
  }, [otpModal]);

  return (
    <Modal>
      <div className="lg:p-8 p-4 w-[90vw] rounded-2xl bg-white lg:min-w-[480px] lg:max-w-lg ">
        <div className="flex flex-col max-h-[80vh] p-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">Verify your phone</p>
            <RxCross1
              className="text-2xl cursor-pointer"
              onClick={() => setOtpModal(false)}
            />
          </div>
          <div className="flex justify-center items-center py-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 mx-1 text-center border rounded focus:outline-none focus:border-blue-500"
                ref={(ref) => (inputs.current[index] = ref)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 pt-3 border-t">
          <button
            type="button"
            className="px-4 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-full"
            onClick={() => setOtpModal(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
              loading | otp.some((digit) => digit === "")
                ? "cursor-not-allowed py-[14px] opacity-50"
                : "py-[12px]"
            }`}
            disabled={loading | otp.some((digit) => digit === "")}
          >
            {loading ? <div className="loaderProfile mx-auto "></div> : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OtpModal;
