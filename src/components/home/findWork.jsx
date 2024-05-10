import { Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export const FindWork = () => {
  return (
    <div className="w-full bg-[rgb(231,255,221)]  px-0 py-[45px]">
      <div className="overflow-hidden mx-auto my-0">
        <Container>
          <Stack sx={{ position: "relative" }}>
            <div className="">
              <h1 className="text-[rgb(53,185,0)] text-3xl capitalize mb-10">
                YETENEĞİN DOĞRULTUSUNDA İŞ BUL!
              </h1>
              <p className="text-[rgb(92,91,91)] text-xl  break-words text-left mb-[25px]">
                <i className="ri-checkbox-circle-line"></i> Birlikte çalışmaktan
                heyecan duyduğumuz iş verenlerimiz ile tanışın. Kariyerinizi ve
                işinizi zirveye taşıyın.
              </p>
              <p className="text-[rgb(92,91,91)] text-xl  break-words text-left mb-[25px]">
                <i className="ri-checkbox-circle-line"></i> Serbest
                kariyerinizin her aşaması için fırsatlar bulun.
              </p>
              <p className="text-[rgb(92,91,91)] text-xl  break-words text-left mb-[25px]">
                <i className="ri-checkbox-circle-line"></i> Ne zaman, nerede ve
                nasıl çalışacağınıza kendiniz karar verin.
              </p>
              <p className="text-[rgb(92,91,91)] text-xl  break-words text-left mb-[25px]">
                <i className="ri-checkbox-circle-line"></i> Kazanmak için
                KocFreelancing&ados;i kontrol edin, fırsatları bulun.
              </p>
              <p className="text-[rgb(92,91,91)] text-xl  break-words text-left mb-[25px]">
                <i className="ri-checkbox-circle-line"></i> Unutma!
                KocFreelancing&ados;e <b>kayıt</b> olurken herhangi bir ücret
                ödemiyorsun <b>ayrıca </b>iş İlanlarına teklif verirken ödediğin
                teklif ücretini de işi alamadığın taktirde
                <b>geri iade</b> alıyorsun.
              </p>
              <div className="flex items-center justify-center my-8">
                <Link
                  className=" rounded-3xl  py-3 px-8    bg-primary hover:bg-opacity-90 transition-all border text-white text-center active:scale-95 "
                  to="/categories"
                >
                  Explore More
                </Link>
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <img
                src="assets/img/body4.png"
                alt="body4"
                className="body4Image"
              />
            </div>
          </Stack>
        </Container>
      </div>
    </div>
  );
};
