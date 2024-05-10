import React from "react";

export const AdvertContent = () => {
  return (
    <div className="w-full bg-[whitesmoke] overflow-x-hidden px-0 py-8 lg:py-16">
      <div className="max-w-screen-lg mx-4  flex flex-col-reverse lg:flex-row items-center justify-around lg:mx-auto my-0">
        <div className="lg:w-1/2 mt-6 lg:mt-0">
          <h1 className="text-[rgb(53,185,0)] text-xl lg:text-3xl capitalize mb-2 lg:mb-5">
            KENDİ TARZIN DOĞRULTUSUNDA YETENEK BULABİLİRSİN
          </h1>
          <p className="text-[rgb(92,91,91)] lg:text-xl ">
            Geniş ve bağımsız çalışan kullanıcı ağı sayesinde, işlerin için
            kendi tarzın doğrultusunda bir yetenek bulabilirsin.
          </p>
        </div>
        <img
          src="./assets/img/freelancer2.jpeg"
          alt="freelancer2.jpeg"
          className="h-auto lg:w-1/2  rounded-[5px]"
        />
      </div>
    </div>
  );
};
