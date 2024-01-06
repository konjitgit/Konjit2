/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useMemo } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
function AdHero() {
  const [imageIndex, setImageIndex] = useState(0);
  const images = useMemo(
    () => ["/images/ad1.jpg", "/images/ad2.jpg", "/images/SellerSignUp.jpg"],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => {
      clearInterval(interval);
    };
  }, [images]);
  return (
    <div className="mx-auto w-[90%] h-[50v] mt-20 sd:mt-[130px]">
      {/* <img
        src={images[imageIndex]}
        alt="Dynamic"
        className="w-full h-[400px] rounded-lg mt-10 object-cover"
      /> */}
      <Splide
        aria-label="My Favorite Images"
        options={{
          type: "loop",
          pagination: true,
          autoplay: true,
          interval: 10000,
        }}
        className="homeCar"
      >
        <SplideSlide>
          <img
            src={images[0]}
            alt="Image 1"
            className="w-full h-[400px] rounded-lg mt-10 object-cover"
          />
        </SplideSlide>
        <SplideSlide>
          <img
            src={images[1]}
            alt="Image 2"
            className="w-full h-[400px] rounded-lg mt-10 object-cover"
          />
        </SplideSlide>
        <SplideSlide>
          <img
            src={images[2]}
            alt="Image 4"
            className="w-full h-[400px] rounded-lg mt-10 object-cover"
          />
        </SplideSlide>
      </Splide>
    </div>
  );
}

export default AdHero;
