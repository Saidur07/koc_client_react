import React, { useEffect, useState } from "react";
import Navbar from "../../components/layouts/Navbar";
import Footer from "../../components/layouts/Footer";
import { useSelector } from "react-redux";
const Contact = () => {
  const loading = useSelector((state) => state.user?.loading);
  const userProfile = useSelector((state) => state.user?.data);

  return (
    <div>
      <Navbar />

      <div className="mt-28 mx-2 lg:mx-auto max-w-screen-xl">
        <div className="border rounded-3xl w-full my-6 p-6 ">
          <div className="flex items-center justify-center flex-col">
            <p className="text-3xl font-medium">Contact Us</p>
            <p className="text-secondary font-medium my-1 ">
              We'll connect with you as soon as possible.
            </p>
          </div>
          <form
            // onSubmit={handleSubmit(onSubmit)}
            className="lg:p-8 p-4  rounded-2xl bg-white  "
          >
            <div className="flex flex-col  ">
              <div className="flex flex-col space-y-2 my-4">
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="w-1/2">
                    <label htmlFor="sub_title" className=" font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="sub_title"
                      name="sub_title"
                      className="w-full p-3  border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Your First Name"
                      value={userProfile ? userProfile?.user?.first_name : ""}
                      disabled={userProfile ? true : false}
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="sub_title" className=" font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="sub_title"
                      name="sub_title"
                      className="w-full p-3  border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Your Last Name"
                      value={userProfile ? userProfile?.user?.last_name : ""}
                      disabled={userProfile ? true : false}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                  <label htmlFor="email" className="col-span-full font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="col-span-full p-3  border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ex: example@gmail.com"
                    value={userProfile ? userProfile?.user?.email : ""}
                    disabled={userProfile ? true : false}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                  <label
                    htmlFor="subject"
                    className="col-span-full font-medium"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="col-span-full p-3  border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter Subject"
                  />
                </div>

                <div className="">
                  <label
                    htmlFor="description"
                    className="col-span-full font-medium "
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={10}
                    className="w-full rounded-md border border-gray-300 shadow-sm p-3  focus:outline-none focus:ring-primary focus:border-primary mt-2"
                    placeholder="Enter Description"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-2 pt-3 border-t">
              <button
                type="submit"
                className={`px-4  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
                  loading ? "cursor-not-allowed py-[18px] opacity-50" : "py-3"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="loaderProfile mx-auto "></div>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
