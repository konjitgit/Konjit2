import React, { useState } from "react";
import OrderSummary from "../Checkout/OrderSummary";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const Payment = () => {
  
  const orderData = localStorage.getItem("latestOrder")
    ? JSON.parse(localStorage.getItem("latestOrder"))
    : [];
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  return (
    <div>
      {/* <div className=" 900px:w-[550px] ">
              {cart &&
                cart.map((i, index) => {
                  console.log(i);
                  return (
                    <OrderSummary
                      key={index}
                      data={i}
                      handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
            showDiv={showDiv}
                    />
                  );
                })}
           
        </div> */}
      <div className={`${styles.section} my-3`}>
        <div className="border-2 border-[#B5B5B5] rounded-lg p-2 md:p-4  sm:max-w-[550px] md:mx-2">
          <div className="flex gap-3 justify-between  border-b-[1px] border-[#B5B5B5] p-2 md:mx-4 ">
            <div className="flex gap-6 mx-0">
              <p className="text-[#505050] font-light">Contact</p>
              <p>{user.email}</p>
            </div>
            <Link to="/checkout" className="mx-0">
              <p className="underline"> Change</p>
            </Link>
          </div>

          <div className="flex gap-3 justify-between  border-b-[1px] border-[#B5B5B5] p-2 md:mx-4 ">
            <div className="flex gap-6 mx-0">
              <p className="text-[#505050] font-light">Deliver to</p>
              {/* <p>(No address)</p> */}
              <p className="text-[#505050]">
                {orderData.shippingAddress.address1 ? `${orderData.shippingAddress.address1}` : `(No address)`}
              </p>
            </div>
            <Link to="/checkout" className="mx-0">
              <p className="underline"> Change</p>
            </Link>
          </div>

          <div className="flex gap-3 justify-between   p-2 md:mx-4 ">
            <div className="flex gap-6 mx-0">
              <p className="text-[#505050] font-light" >
                Method
              </p>
              <div className="flex flex-col">
                <div className=" flex flex-col sm:flex-row">
                  <p className="text-[15px]"> {orderData.deliveryMethod} </p>
                  
                </div>
                {/*<p className=" text-xs ">
                  8 Thistle Avenue, Upper Plain, WGN, Masterton
      </p>*/}
              </div>
            </div>
            <Link to="/checkout" className=" mx-0 ">
              <p className="underline text-black"> Change</p>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <div className="">
            <p className="mb-2 tracking-wide text-xl text-black pb-2">Payment</p>
            <p className="text-[#505050] text-sm">
              All transactions are secure and encrypted
            </p>
            <div className="w-[60%]">
            <Payment2 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

const Payment2 = () => {
  const orderData = localStorage.getItem("latestOrder")
    ? JSON.parse(localStorage.getItem("latestOrder"))
    : [];

  const [txRef, setTxRef] = useState(generateUniqueTxRef());
  const [amount, setAmount] = useState(orderData.totalPrice);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [email, setEmail] = useState(orderData.user.email);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  console.log("orderData", orderData.user.email);
  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };
  function generateUniqueTxRef() {
    return `negade-tx-${Date.now()}${Math.random().toString(36).substring(7)}`;
  }

  return (
    <div className="app">
      <form
        className=""
        method="POST"
        action="https://api.chapa.co/v1/hosted/pay"
      >
        <input
          type="hidden"
          name="public_key"
          value="CHAPUBK_TEST-VBKHiQBD39y6aQCJsk7pL7iijVcqHjfw"
        />

        <div className="py-2">
          <label
            htmlFor="amount"
            className="block mb-2 font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="text"
            id="amount"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="py-2"> 
          <label htmlFor="currency" className="block font-medium text-gray-700">
            Currency
          </label>
          <select
            id="currency"
            className="h-[40px]  border border-gray-400 rounded-sm  w-full max-w-sm  mt-3 px-3 py-2   shadow-sm  placeholder-slate-800 focus:outline-none focus:border-[#B5B5B5;] focus:ring-[#B5B5B5;] block  text-sm focus:ring-1 bg-white"
            name="currency"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
          >
            <option value="">Select Currency</option>
            <option value="ETB">ETB</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div className="py-2">
          <label htmlFor="txRef" className="block mb-2 font-medium text-gray-700">
            Your UniqueTransaction Reference
          </label>
          <input
            type="text"
            id="txRef"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            name="tx_ref"
            value={txRef}
            readOnly
          />
        </div>
        <div className="py-2">
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            name="email"
            value={email }
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="py-2">
          <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="py-2">
          <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <input
          type="hidden"
          name="logo"
          value="https://chapa.link/asset/images/chapa_swirl.svg"
        />
        <input
          type="hidden"
          name="callback_url"
          value="https://example.com/callbackurl"
        />
        <input type="hidden" name="return_url" value="https://konjit2-pous.vercel.app/order-success" />
        <input type="hidden" name="meta[title]" value="test" />

        <button type="submit" className={`${styles.button}`}>
          Pay Now
        </button>
      </form>
    </div>
  );
};
