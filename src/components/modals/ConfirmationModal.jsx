import React from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";

const ConfirmationModal = ({ title = "item", loading, onClose, onConfirm }) => {
  return (
    <Modal>
      <div
        id="popup-modal"
        tabIndex={-1}
        className="z-[50000]  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
      >
        <div className="relative w-full h-full max-w-md md:h-auto">
          <div className="relative bg-white rounded-lg  ">
            <div className="flex items-center justify-end ">
              <RxCross1
                className="text-2xl cursor-pointer mr-4 mt-4"
                onClick={() => onClose(false)}
              />
            </div>
            <div className="px-6 pb-6 text-center">
              <svg
                aria-hidden="true"
                className="mx-auto mb-4 text-secondary w-14 h-14 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="mb-5 text-lg font-normal text-secondary ">
                Are you sure you want to {title}?
              </h3>
              <div className="flex items-center justify-between space-x-2 pt-3 border-t">
                <button
                  className={`px-4 whitespace-nowrap  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
                    loading ? "cursor-not-allowed py-[18px] opacity-50" : "py-3"
                  }`}
                  onClick={onConfirm}
                >
                  {loading ? (
                    <div className="loaderProfile mx-auto "></div>
                  ) : (
                    "Yeah, I'm sure"
                  )}
                </button>
                <button
                  type="button"
                  className="px-4 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-full"
                  onClick={() => onClose(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
