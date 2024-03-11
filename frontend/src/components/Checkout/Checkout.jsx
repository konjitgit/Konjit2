import React, { useState, useEffect } from "react";

import { Country, State } from "country-state-city";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { CiDeliveryTruck } from "react-icons/ci";
import { GrLocation } from "react-icons/gr";
import { SlArrowLeft } from "react-icons/sl";
import styles from "../../styles/styles";
import OrderSummary from "./OrderSummary.jsx";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [deliveryMethod, setdeliveryMethod] = useState("");
  const [onCashDelivery, setonCashDelivery] = useState(true);
  console.log(cart);
  console.log(user);
  const navigate = useNavigate();
  // The state variable for the display status of the div
  const [showDiv, setShowDiv] = useState("first");
  const [active, setActive] = useState(true);

  // The function to toggle the active status of the button
  const toggleActive = (prev) => {
    setActive(prev);
  };

  // The function to toggle the display status of the div
  const toggleDiv = (button) => {
    setShowDiv(button);
  };

  // setdeliveryMethod(showDiv)
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  //   group cart items by shopId
  const shopItemsMap = new Map();

  for (const item of cart) {
    const shopId = item.shopId;
    if (!shopItemsMap.has(shopId)) {
      shopItemsMap.set(shopId, {
        items: [],
        address: item.shop.address,
        shopName: item.shop.name,
      });
    }
    shopItemsMap.get(shopId).items.push(item);
  }

  //  console.log('shopItemsMap after push',shopItemsMap )
  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode("");
      }
    });
  };
  console.log(showDiv);
  console.log(onCashDelivery);
  const discountPercentenge = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  //console.log(discountPercentenge);
  let orderData = {};
  // on click handler for payment and pickup delivery methods
  const paymentSubmit = () => {
    
    
    if (showDiv === "first") {
      if (
        address1 === "" ||
        address2 === "" ||
        //zipCode === null ||
        country === "" ||
        city === ""
      ) {
        toast.error("Please choose your delivery address!");
        return;
      } else {
        setdeliveryMethod("shipping");
        console.log(deliveryMethod);
        const shippingAddress = {
          address1,
          address2,
          //zipCode,
          country,
          city,
        };
        
        
        orderData = {
          cart,
          totalPrice,
          subTotalPrice,
          deliveryMethod: "Shipping",
          onCashDelivery: false,
          name,
          phoneNumber,
          shipping,
          discountPrice,
          shippingAddress,
          user,
        };
      }
    } else if (showDiv === "second") {
      setdeliveryMethod("pickup");
      orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        deliveryMethod: "Pickup",
        onCashDelivery: false,
        //shipping,
        discountPrice,
        shippingAddress: "pick up",
        user,
      };
    }
    console.log(orderData);
    /* cart data:
  _v,
  _id,
  category,
  createdAt,
  description,
  discountPrice,
  images:Array,
  name,
  originalPrice,
  qty,
  reviews:Array,
  shop:object{role,availibleBalance,createdAt,address,...},
  shopId,
  sold_out,
  stock,
  tags
 
*/
    // update local storage with the updated orders array
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
  };

  //on click handel for the on cash delivery method
  const handleOnCashDelivery = () => {
    if (address1 === "" || address2 === "" || country === "" || city === "") {
      toast.error("Please choose your delivery address!");
      return;
    } else {
      setdeliveryMethod("shipping");
      console.log(deliveryMethod);
      const shippingAddress = {
        address1,
        address2,
        //zipCode,
        country,
        city,
      };

      orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        deliveryMethod: "Shipping",
        onCashDelivery,
        name,
        phoneNumber,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };
    }
    // update local storage with the updated orders array
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/order-success");
  };

  return (
    <>
      <div className={`${styles.section}`}>
        <div className=" flex flex-col  justify-center md:flex-row-reverse gap-4 mx-auto">
          <div className=" 900px:w-[550px] mr-[150px] ">
            <OrderSummary
              handleSubmit={handleSubmit}
              totalPrice={totalPrice}
              shipping={shipping}
              subTotalPrice={subTotalPrice}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              discountPercentenge={discountPercentenge}
              showDiv={showDiv}
            />
          </div>

          {/* delivery method */}
          <div className={`${styles.section} my-4 md:ml-[150px]`}>
            <p className="text-xl sm:text-2xl font-medium uppercase">
              Delivery Method
            </p>

            <div className="flex flex-col  my-4">
              {/* The first button that can show or hide the first div */}
              <div className=" w-full flex flex-row h-[45px] md:ml-4">
                <div
                  className={`${
                    active ? "bg-beige text-black" : "bg-[#F9F9F9] "
                  } p-2 px-8 border-r-4 border-[#B5B5B5]    hover:bg-beige focus:outline-none flex flex-row items-center justify-center cursor-pointer mx-0`}
                  onClick={() => {
                    toggleDiv("first");
                    toggleActive(true);
                    setonCashDelivery(true)
                  }}
                >
                  <CiDeliveryTruck size={18} className="h-[18px]" />

                  <span className="pl-2">Shipping</span>
                </div>
                {/* The second button that can show or hide the second div */}
                <div
                  className={` ${
                    active ? "bg-[#F9F9F9] " : "bg-beige text-black "
                  } p-2  px-8  hover:bg-beige focus:outline-none mx-0  flex flex-row items-center justify-center cursor-pointer`}
                  onClick={() => {
                    toggleDiv("second");
                    toggleActive(false);
                    setonCashDelivery(false)
                  }}
                >
                  <GrLocation size={18} className="h-[18px]" />
                  <span className="pl-2">Pick Up</span>
                </div>
              </div>

              {/* The first div that is shown or hidden based on the state variable and the first button */}
              {showDiv === "first" && (
                <div className=" mx-0 max-w-[650px] bg-white overflow-hidden  my-4  ">
                  <div className="py-4">
                    <div className=" tracking-wide text-lg text-black pb-2">
                      Shipping Address
                    </div>

                    <p className="mt-2 text-slate-500 text-sm ">Required *</p>
                    <form action="" className="flex flex-col">
                      <div className="sm:flex gap-2 w-full">
                        <input
                          type="text"
                          className="border border-gray-400 rounded-sm  w-full max-w-sm  mt-3 px-3 py-2   shadow-sm  placeholder-slate-800 focus:outline-none focus:border-[#B5B5B5;] focus:ring-[#B5B5B5;] block  text-sm focus:ring-1"
                          placeholder="Full Name *"
                          value={ name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        ></input>

                        {/* <input
                        type="text"
                        className="border border-gray-400 rounded-sm  w-full max-w-sm  mt-3 px-3 py-2   shadow-sm  placeholder-slate-800 focus:outline-none focus:border-[#B5B5B5;] focus:ring-[#B5B5B5;] block  text-sm focus:ring-1"
                        placeholder="Last Name *"
                        required
                      ></input> */}
                        <input
                          type="tel"
                          placeholder="Phone Number *"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className={`border border-gray-400 rounded-sm  w-full max-w-sm  mt-3 px-3 py-2   shadow-sm  placeholder-slate-800 focus:outline-none focus:border-[#B5B5B5;] focus:ring-[#B5B5B5;] block  text-sm focus:ring-1`}
                        />
                      </div>

                      <input
                        type="text"
                        className="border border-gray-400 rounded-sm  w-full sm:w-[50%]  mt-3 px-3 py-2   shadow-sm  placeholder-slate-800 focus:outline-none focus:border-[#B5B5B5;] focus:ring-[#B5B5B5;] block  text-sm focus:ring-1"
                        placeholder="Address 1*"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                      ></input>

                      <input
                        type="text"
                        className="border border-gray-400 rounded-sm  w-full sm:w-[50%] mt-3 px-3 py-2   shadow-sm  placeholder-slate-800 focus:outline-none focus:border-[#B5B5B5;] focus:ring-[#B5B5B5;] block  text-sm focus:ring-1"
                        placeholder="Address 2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                      ></input>

                      <div className="w-full  pb-3 sm:flex-row flex gap-2 ">
                        <div className="sm:w-[50%]">
                          <select
                            className=" h-[40px]  border border-gray-400 rounded-sm  w-full max-w-sm  mt-3 px-3 py-2   shadow-sm  placeholder-slate-800 focus:outline-none focus:border-[#B5B5B5;] focus:ring-[#B5B5B5;] block  text-sm focus:ring-1 bg-white"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          >
                            <option className="block pb-2" value="">
                              Choose your country *
                            </option>
                            {Country &&
                              Country.getAllCountries().map((item) => (
                                <option key={item.isoCode} value={item.isoCode}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="sm:w-[50%]">
                          <select
                            className="  h-[40px]  bg-white border border-gray-400 rounded-sm w-full  max-w-sm  mt-3 px-3 py-2   shadow-sm  placeholder-slate-800 focus:outline-none focus:border-[#B5B5B5;] focus:ring-[#B5B5B5;] block  text-sm focus:ring-1"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          >
                            <option
                              className="block pb-2 border border-gray-400 rounded-sm  w-full max-w-sm  mt-3 px-3 py-2   shadow-sm  "
                              value=""
                            >
                              Choose your City
                            </option>
                            {State &&
                              State.getStatesOfCountry(country).map((item) => (
                                <option key={item.isoCode} value={item.isoCode}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </form>

                    <p
                      className="text-[18px] cursor-pointer inline-block hover:text-pink underline"
                      onClick={() => setUserInfo(!userInfo)}
                    >
                      Choose From saved address
                    </p>
                    {userInfo && (
                      <div>
                        {user &&
                          user.addresses.map((item, index) => (
                            <div className="w-full flex mt-1">
                              <input
                                type="checkbox"
                                className="mr-3"
                                value={item.addressType}
                                onChange={() =>
                                  setAddress1(item.address1) ||
                                  setAddress2(item.address2) ||
                                  setCountry(item.country) ||
                                  setCity(item.city)
                                }
                              />
                              <h2>{item.addressType}</h2>
                            </div>
                          ))}
                      </div>
                    )}

                    <div>
                      <input
                        type="checkbox"
                        name="onCashDelivery"
                        id="onCashDelivery"
                        checked={onCashDelivery}
                        onChange={() => setonCashDelivery(!onCashDelivery)}
                      />
                      <h3 className="inline">On Cash Delivery</h3>
                    </div>

                    {/* {!onCashDelivery ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={loading ? true : false}
              className={`${
                loading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              Place Order
            </button>
          </>
        ) : null

        <Button variant="contained" color="primary" onClick={placeOrder}>Place Order</Button>
        
      </div>
      
    </div>
  );
};*/}
                  </div>
                </div>
              )}

              {/* The second div that is shown or hidden based on the state variable and the second button */}
              {showDiv === "second" && (
                <div className="mt-8">
                  <div className=" tracking-wide text-lg text-black fon">
                    Pickup Locations
                  </div>
                  <div>
                    {Array.from(shopItemsMap).map(
                      ([shopId, { address, items, shopName }]) => (
                        <div className="max-w-[550px] mx-2 bg-white  overflow-hidden  my-4  ">
                          <div className="">
                            {/* {console.log(showDiv)} */}
                            <div className="flex flex-col " key={shopId}>
                              <div className="rounded-lg border-[#505050] border p-2 bg-beige">
                                <p className="">
                                  {/* Hebe Concept Store (18.54km) */}
                                  {shopName}
                                </p>
                                <p className="text-[#505050]">
                                  {/* 8 Thistle Avenue, Upper Plain WGN, Masterton{" "} */}
                                  {address}
                                </p>
                                <p className="text-[#505050]">
                                  Usually ready in 24 hours
                                </p>
                                <div></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex sm:flex-row flex-col-reverse gap-4 items-center justify-between max-w-[650px]">
              <div className="flex flex-row items-center justify-center cursor-pointer mx-0 gap-4 hover:text-pink ">
                <SlArrowLeft size={18} className="h-[16px] mx-0" />
                <Link to={"/cart"}>
                  <p>Return to cart</p>
                </Link>
              </div>
              {onCashDelivery ? (
                <div className="mx-0">
                  <button
                    onClick={handleOnCashDelivery}
                    // disabled={loading ? true : false}
                    className={`${styles.button}`}
                  >
                    Place Order
                  </button>
                </div>
              ) : (
                <div className="mx-0">
                  <button
                    className={`${styles.button} `}
                    onClick={paymentSubmit}
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
