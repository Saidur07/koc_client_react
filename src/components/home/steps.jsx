import React from "react";
import { IoMegaphoneSharp } from "react-icons/io5";
import { FaCheckDouble } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const Steps = () => {
  return (
    <div className="w-full overflow-x-hidden bg-[whitesmoke] px-0 py-[45px]">
      <div className="max-w-screen-xl flex items-center justify-around mx-auto my-0">
        <div className=" ">
          <h1 className="text-[rgb(53,185,0)] text-xl lg:text-3xl capitalize text-center mb-10">
            3 ADIMDA İŞİNİZİ HALLEDİN
          </h1>
          <p className="flex items-center gap-x-4 lg:w-10/12 text-[rgb(92,91,91)] text-xl text-left mb-[15px] pl-[35px]">
            <FaWpforms className="text-2xl  rounded-[100px] " />{" "}
            KocFreelancing'e kayıt olun.
          </p>
          <p className="flex items-center gap-x-4 lg:w-10/12 text-[rgb(92,91,91)] text-xl text-left mb-[15px] pl-[35px]">
            <IoMegaphoneSharp className="text-2xl  rounded-[100px] " /> İşiniz
            için ilan verin.
          </p>
          <p className="flex items-center gap-x-4 lg:w-10/12 text-[rgb(92,91,91)] text-xl text-left  pl-[35px]">
            <FaCheckDouble className="text-2xl  rounded-[100px] " /> Gelen
            tekliflerden işinize uygun olan profesyoneli seçin.
          </p>
          &nbsp;{" "}
          <div className="flex items-center justify-center my-2">
            <Link
              className=" rounded-3xl  py-3 px-8    bg-primary hover:bg-opacity-90 transition-all border text-white text-center active:scale-95 "
              to="/categories"
            >
              Explore Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
