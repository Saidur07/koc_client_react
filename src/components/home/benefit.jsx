import { IoIosStarOutline } from "react-icons/io";
import { CiDollar, CiLock } from "react-icons/ci";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

export const Benefit = () => {
  return (
    <div className="w-full bg-[rgb(231,255,221)] px-0 py-[45px]">
      <div className="max-w-screen-xl flex overflow-x-hidden items-center justify-around px-4 mx-auto my-0">
        <div className="w-full">
          <h1 className="text-[rgb(53,185,0)] text-3xl capitalize  mb-5">
            KULLANICILAR NEDEN KOCFREELANCING'İ TERCİH EDİYOR?
          </h1>
          <p className="flex items-center gap-x-4  text-[rgb(92,91,91)] text-xl text-left mb-[25px] ">
            <IoIosStarOutline className="text-2xl" /> Üye olma ücreti yok.
          </p>
          <p className="flex items-center gap-x-4  text-[rgb(92,91,91)] text-xl text-left mb-[25px] ">
            <CiDollar className="text-2xl" /> İşinizi teslim alıp onay verene
            kadar paranız provizyonda bekletilir.
          </p>
          <p className="flex items-center gap-x-4  text-[rgb(92,91,91)] text-xl text-left mb-[25px] ">
            <FaPeopleGroup className="text-2xl" /> Geniş ve profesyonel
            kullanıcı ağına sahiptir.
          </p>
          <p className="flex items-center gap-x-4  text-[rgb(92,91,91)] text-xl text-left mb-[25px] ">
            <MdOutlineMiscellaneousServices className="text-2xl" /> İki taraflı
            kullanıcı sözleşmeleri ve doğrulamaları ile birlikte, çalışan ve iş
            veren arasında güven bağı oluşturulur.
          </p>
          <p className="flex items-center gap-x-4  text-[rgb(92,91,91)] text-xl text-left mb-[25px] ">
            <CiLock className="text-2xl" /> Verilerinizi ve gizliliğinizi özenle
            korumaya yönelik adımlar atıyoruz.
          </p>
          <p className="flex items-center gap-x-4  text-[rgb(92,91,91)] text-xl text-left mb-[25px] ">
            <IoPeopleSharp className="text-2xl" /> İhtiyacınız olduğu anda 7/24
            canlı destek ile buradayız.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center my-2">
        <Link
          className=" rounded-3xl  py-3 px-8    bg-primary hover:bg-opacity-90 transition-all border text-white text-center active:scale-95 "
          to="/categories"
        >
          Explore Now
        </Link>
      </div>
    </div>
  );
};
