import React, { useState } from "react";
import { showProducts } from "../../constants/data";
import { FaRegEye } from "react-icons/fa";

export const Projects = () => {
  const [select, setSelect] = useState(null);

  return (
    <div className="eye-section hidden lg:block">
      <div className="product-title">
        KOCFREELANCING'TE YAPILAN İLHAM VERİCİ ÇALIŞMALAR
      </div>
      <ul className="eye-card">
        {showProducts.map((element, idx) => {
          return (
            <li
              key={`showproducts-${idx}`}
              className={`card-item ${select === idx && "expand"}`}
            >
              <img src={element} alt="" />
              <span
                onClick={() => {
                  if (select === idx) {
                    setSelect(null);
                  } else {
                    setSelect(idx);
                  }
                }}
              >
                <FaRegEye className="w-6 h-6" />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
