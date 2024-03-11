import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Processing");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Order updated!");
        navigate("/shop-products");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
 console.log(status)
  // console.log(data?.status);


  return (
    <div
      className={`py-4 min-h-screen ${styles.section} w-[80%] rounded-lg bg-beige/50 my-10 p-5`}
    >
      <div className="mx-auto flex items-center justify-between  w-fit">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-3xl font-bold">Order Details</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-center mb-5 bg-pink/5 rounded-lg">
            <div className="w-[120px] h-[120px]">
              <img
                src={`${item.images[0]?.url}`}
                alt=""
                className="w-full h-full"
              />
            </div>
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 text-[15px] text-[#00000091]">
                ETB {item.discountPrice} x {item.qty}
              </h5>
            </div>
          </div>
        ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px] ">
          Total Price:{" "}
          <strong className="text-xl">ETB {data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%] flex- flex-col justify-evenly gap-14">
          <h4 className="pt-3 text-[23px] font-[600]">Shipping Address:</h4>
          <div className="pt-3 text-xl">
            <br />
            Address:
            <span className="text-gray-500 text-lg ml-2">
              {data?.shippingAddress.address1 +
                " " +
                data?.shippingAddress.address2}
            </span>
          </div>
          <div className=" ">
            Country:{" "}
            <span className="text-gray-500 text-lg">
              {" "}
              {data?.shippingAddress.country}
            </span>
          </div>
          <div className=" ">
            City:{" "}
            <span className="text-gray-500 text-lg">
              {data?.shippingAddress.city}
            </span>
          </div>
          <div className=" ">
            PhoneNumber:
            <span className="text-gray-500 text-lg">
              {" "}
              {data?.user?.phoneNumber}
            </span>
          </div>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 ">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
      >
        {["Processing", "Delivered"].map((option, index) => (
          <option value={option} key={index}>
            {option}
          </option>
        ))}
      </select>

      <div
        className={`${styles.button} mt-5 bg-pink !rounded-[4px]  font-[600] !h-[45px] text-[18px]`}
        onClick={orderUpdateHandler}
      >
        Update Status
      </div>
    </div>
  );
};

export default OrderDetails;
