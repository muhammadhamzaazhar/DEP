import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./components/navbar/navbar.component";
import Home from "./pages/home/home.page";
import Authentication from "./pages/authentication/authentication.page";
import ShopListing from "./pages/shop-listing/shop-listing.page";
import Favourite from "./pages/favourite/favourite.page";
import Cart from "./pages/cart/cart.page";
import ProductDetails from "./pages/product-details/product-details.page";
import ToastMessage from "./components/toast-message/toast-message.component";

const App = () => {
  const { currentUser } = useSelector((state) => state.user || {});
  const { open, message, severity } = useSelector((state) => state.user || {});

  const [openAuth, setOpenAuth] = useState(false);

  return (
    <div className="container">
      <Navbar setOpenAuth={setOpenAuth} currentUser={currentUser} />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/shop" exact element={<ShopListing />} />
        <Route path="/favorite" exact element={<Favourite />} />
        <Route path="/cart" exact element={<Cart />} />
        <Route path="/shop/:id" exact element={<ProductDetails />} />
      </Routes>
      {openAuth && (
        <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} />
      )}
      {open && (
        <ToastMessage open={open} message={message} severity={severity} />
      )}
    </div>
  );
};

export default App;
