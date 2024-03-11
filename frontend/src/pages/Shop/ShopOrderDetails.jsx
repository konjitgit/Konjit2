import React from "react";
import OrderDetails from "../../components/Shop/OrderDetails";
import Footer from "../../components/Footer/Footer1";
import SellerHeader from "../../components/Layout/SellerHeader";

const ShopOrderDetails = () => {
  return (
    <div>
      <SellerHeader />
      <OrderDetails />
      <Footer />
    </div>
  );
};

export default ShopOrderDetails;
