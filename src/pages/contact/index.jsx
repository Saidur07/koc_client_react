import React, { useEffect, useState } from "react";
import Navbar from "../../components/layouts/Navbar";
import Footer from "../../components/layouts/Footer";
import { useSelector } from "react-redux";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import axios from "axios";
import toast from "react-hot-toast";

const Contact = () => {
  const loading = useSelector((state) => state.user?.loading);
  const userProfile = useSelector((state) => state.user?.data);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const onSendEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/contact/sendEmail`,
        {
          first_name: userProfile?.user?.first_name,
          last_name: userProfile?.user?.lastName,
          email: userProfile?.user?.email,
          subject: subject,
          message: message,
        }
      );
      if (res.status == 200) {
        toast.success("Message sent successfully");
      } else {
        toast.error("Something went wrong, try again later");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <Navbar />

      <div className=" max-w-screen-xl  my-28 mx-4 lg:mx-auto grid lg:md:grid-cols-2 grid-cols-1 gap-x-6 items-center">
        <div className="lg:md:block hidden">
          <Player
            autoplay
            loop
            src="https://lottie.host/549354c4-d04c-43fa-a952-a6f476b42667/LmGO8bZWsF.json"
            className="lg:md:h-[800px] h-[50vh]"
          >
            <Controls
              visible={false}
              buttons={["play", "repeat", "frame", "debug"]}
            />
          </Player>
        </div>
        <div className="w-full">
          <div className="border rounded-3xl w-full my-6 lg:md:p-6 p-2 ">
            <div className="flex items-center justify-center flex-col">
              <p className="lg:md:text-3xl text-2xl font-medium text-center">
                Contact Us
              </p>
              <p className="text-secondary font-medium my-1 text-center">
                We'll connect with you as soon as possible.
              </p>
            </div>
            <form
              onSubmit={onSendEmail}
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
                        value={userProfile ? userProfile?.user?.lastName : ""}
                        disabled={userProfile ? true : false}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                    <label
                      htmlFor="email"
                      className="col-span-full font-medium"
                    >
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
                      onChange={(e) => setSubject(e.target.value)}
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
                      onChange={(e) => setMessage(e.target.value)}
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
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
