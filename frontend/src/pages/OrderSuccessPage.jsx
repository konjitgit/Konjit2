import React ,{useEffect, useState} from 'react'
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link ,  useNavigate} from "react-router-dom";
import { server } from "../server";
import axios from 'axios'

function OrderSuccessPage() {
  
  
 // const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
   
    PaymentHandler()
  }, []);
  const orderData = localStorage.getItem("latestOrder")
  ? JSON.parse(localStorage.getItem("latestOrder"))
  : [];


  const cart = orderData?.cart
  const  shippingAddress= orderData?.shippingAddress
  const deliveryMethod = orderData?.deliveryMethod
  const user = orderData?.user
  const  totalPrice =  orderData?.totalPrice

  const paymentInfo =  {
    id: orderData?.user._id,
    status: "succeeded",
    type: "chapa",
  }

/*  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
    paymentInfo : {
      //id: orderData?.user._id,
      status: "succeeded",
      type: "chapa",
    },
  };*/

  const PaymentHandler = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

   /* order.paymentInfo = {
      id: orderData.user._id,
      status: "succeeded",
      type: "chapa",
    };*/

    await axios
      .post(`${server}/order/create-order`, 
      {cart, shippingAddress,deliveryMethod, user, totalPrice, paymentInfo}, 
      config)
      .then((res) => {
       
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
       
       setTimeout(() => {
        window.location.reload();
      }, 3000);
       setTimeout(() => {
        navigate("/");
      }, 3000);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  return (
    <div className='h-[100vh] mx-auto bg-beige  flex justify-center items-center'>
      <div className='bg-pattern p-8 border '><h1 className='text-xl'>Order Placed Successfully!</h1>
      <p className='text-lg'>Thank you for your purchase.</p>
      <p>An email with the order details has been sent to your registered email address.</p></div>
      {/* Add additional information or components as needed */}
    </div>
  )
}

export default OrderSuccessPage