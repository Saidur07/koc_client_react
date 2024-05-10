import { motion, Variants } from "framer-motion";
import React, { ReactNode } from "react";
import Backdrop from "./Backdrop";

const Modal = ({ children }) => {
  const comeIn = {
    hidden: {
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <Backdrop>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-base100 rounded-2xl "
        variants={comeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
