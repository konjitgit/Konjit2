import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import CartSingle from "./CartSingle";
import { useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [quantities, setQuantities] = useState(cart.map(() => 1));

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const getTotalPrice = () => {
    const totalPrice = cart.reduce((accumulator, product) => {
      const productPrice = product.discountPrice * product.qty; // Assuming the price property exists in the product object
      return accumulator + productPrice;
    }, 0);

    return totalPrice;
  };
  const increment = (index) => {
    const newQuantities = [...quantities];
    const newQuantity = newQuantities[index] + 1;

    const item = cart[index];

    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} units of ${item.name} is available`);
    } else {
      newQuantities[index] += 1;
      setQuantities(newQuantities);

      // Update the quantity in the cart array
      const updatedCart = [...cart];
      updatedCart[index] = { ...updatedCart[index], qty: newQuantities[index] };

      // Update the cart in localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }
  };

  const decrement = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 1) {
      newQuantities[index] -= 1;
      setQuantities(newQuantities);
      const updatedCart = [...cart];
      updatedCart[index] = {
        ...updatedCart[index],
        qty: newQuantities[index],
      };

      // Update the cart in localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    } else {
      toast.error("Product quantity can't be less than one");
    }
  };

  const calculateTotalCartPrice = () => {
    let total = 0;
    cart.forEach((item, index) => {
      const quantity = quantities[index];
      total += item.discountPrice * quantity;
    });
    return total;
  };

  const total = calculateTotalCartPrice();
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-10 bg-black bg-opacity-90">
      <div className="overflow-y-scroll fixed top-0 right-0 w-full sm:w-[65%] md:w-[50%] lg:w-[40%]  h-full flex flex-col  bg-white shadow-sm">
        <ion-icon
          name="close-outline"
          class="z-10 absolute top-2 right-2  cursor-pointer w-6 h-8 hover:rotate-90 transition-all "
          onClick={() => setOpenCart(false)}
        ></ion-icon>

        <div className=" pt-4 flex flex-col gap-">
          <div className=" p-4 flex flex-col">
            <p className="text-3xl p-2 py-4 font-medium drop-shadow-xl">
              Your Bag
            </p>
            <div className="bg-beige w-full h-fit flex justify-between py-4 px-6 rounded-sm shadow-lg">
              <p>Item</p>
              <p>Price</p>
            </div>
          </div>

          <div className="w-full  min-h-[450px]">
            <div>
              {cart &&
                cart.map((i, index) => {
                  const quantity = quantities[index];

                  return (
                    <div className="p-4">
                      <div className="flex flex-nowrap items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={i.images[0].url}
                            alt="picture"
                            className="w-[80px] h-[130px] md:w-[106px] md:h-[186px] object-contain"
                          />
                          <div className="p-2 flex-1 mr-5">
                            <Link to={`/product/${i.name}`}>
                              <p className="text-base sm:text-lg md:text-xl font-semibold pb-3">
                                {i.name}
                              </p>
                            </Link>
                            <p className="text-sm md:text-base text-gray-500 pb-2">
                              {i.category[0].name}
                            </p>
                            <p className="text-sm md:text-base pb-2">
                              ETB
                              <span className="line-through pr-2 pl-1 text-red-500">
                                {i.originalPrice}
                              </span>
                              {i.discountPrice}
                            </p>
                            <div className="addMinus flex items-center gap-4">
                              <div
                                className="border-black border-2 rounded-full w-[20px] h-[20px] md:w-[25px] md:h-[25px] flex items-center justify-center cursor-pointer"
                                onClick={() => increment(index)}
                              >
                                <HiPlus size={18} />
                              </div>
                              <span className="text-sm md:text-base">
                                {quantity}
                              </span>
                              <div
                                className="border-gray-800 border-2 rounded-full w-[20px] h-[20px] md:w-[25px] md:h-[25px] flex items-center justify-center cursor-pointer"
                                onClick={() => decrement(index)}
                              >
                                <HiOutlineMinus size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-fit ml-10">
                          <div className="w-[90px] md:w-[115px]">
                            <p className="text-center text-sm md:text-base">
                              ETB {i.discountPrice * quantity}
                            </p>
                            <hr className="h-0.5 w-[70%] lg:w-[80%] mx-auto bg-black my-2" />
                            <button
                              className="font-medium w-full text-base lg:text-xl"
                              onClick={() => removeFromCartHandler(i)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* <style jsx>{`
        @media only screen and (min-width: 768px) and (max-width: 975px) {
          
        }
      `}</style> */}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className=" p-4  flex flex-col">
            <div className="bg-beige w-full h-fit flex justify-center gap-2 items-end py-4 px-6 rounded-sm shadow-lg">
              <p>Total Price : </p>
              <p className="text-xl font-bold">{total} ETB</p>
            </div>
          </div>
          <div className="px-5 mb-3">
            <Link to="/checkout">
              <div
                className={`h-[45px] flex items-center justify-center w-[100%] bg-pink rounded-[5px] shadow-black shadow-md hover:bg-black transition-all`}
              >
                <h1 className="text-white text-[20px] font-[600]">Checkout</h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
