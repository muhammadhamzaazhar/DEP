import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

import TextInput from "../../components/text-input/text-input.component";
import Button from "../../components/button/button.component";
import {
  addToCart,
  deleteFromCart,
  getCart,
  placeOrder,
} from "../../api/index";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import "./cart.styles.css";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    completeAddress: "",
  });

  const getProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await getCart(token).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  const addCart = async (id) => {
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: id, quantity: 1 })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const removeCart = async (id, quantity, type) => {
    const token = localStorage.getItem("krist-app-token");
    let qnt = quantity > 0 ? 1 : null;
    if (type === "full") qnt = null;
    await deleteFromCart(token, {
      productId: id,
      quantity: qnt,
    })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, item) => total + item.quantity * item?.product?.price?.org,
      0
    );
  };

  useEffect(() => {
    getProducts();
  }, [reload]);

  const convertAddressToString = (addressObj) => {
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const PlaceOrder = async () => {
    setButtonLoad(true);
    try {
      const isDeliveryDetailsFilled =
        deliveryDetails.firstName &&
        deliveryDetails.lastName &&
        deliveryDetails.completeAddress &&
        deliveryDetails.phoneNumber &&
        deliveryDetails.emailAddress;

      if (!isDeliveryDetailsFilled) {
        dispatch(
          openSnackbar({
            message: "Please fill in all required delivery details.",
            severity: "error",
          })
        );
        return;
      }
      const token = localStorage.getItem("krist-app-token");
      const totalAmount = calculateSubtotal().toFixed(2);
      const orderDetails = {
        products,
        address: convertAddressToString(deliveryDetails),
        totalAmount,
      };

      await placeOrder(token, orderDetails);

      dispatch(
        openSnackbar({
          message: "Order placed successfully",
          severity: "success",
        })
      );
      setButtonLoad(false);

      setReload(!reload);
    } catch (error) {
      dispatch(
        openSnackbar({
          message: "Failed to place order. Please try again.",
          severity: "error",
        })
      );
      setButtonLoad(false);
    }
  };
  return (
    <div className="container">
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="section">
          <div className="title center">Your Shopping Cart</div>
          {products.length === 0 ? (
            <>Cart is empty</>
          ) : (
            <div className="wrapper">
              <div className="left">
                <div className="table head">
                  <div className="table-item bold flex">Product</div>
                  <div className="table-item bold">Price</div>
                  <div className="table-item bold">Quantity</div>
                  <div className="table-item bold">Subtotal</div>
                  <div className="table-item"></div>
                </div>
                {products?.map((item) => (
                  <div className="table" key={item?.product?._id}>
                    <div className="table-item flex">
                      <div className="product">
                        <img
                          className="img"
                          src={item?.product?.img}
                          alt={item?.product?.title}
                        />
                        <div className="details">
                          <div className="protitle">{item?.product?.title}</div>
                          <div className="prodesc">{item?.product?.name}</div>
                          <div className="prosize">Size: Xl</div>
                        </div>
                      </div>
                    </div>
                    <div className="table-item">
                      ${item?.product?.price?.org}
                    </div>
                    <div className="table-item">
                      <div className="counter">
                        <div
                          style={{
                            cursor: "pointer",
                            flex: 1,
                          }}
                          onClick={() =>
                            removeCart(item?.product?._id, item?.quantity - 1)
                          }
                        >
                          -
                        </div>
                        {item?.quantity}
                        <div
                          style={{
                            cursor: "pointer",
                            flex: 1,
                          }}
                          onClick={() => addCart(item?.product?._id)}
                        >
                          +
                        </div>
                      </div>
                    </div>
                    <div className="table-item">
                      {" "}
                      ${(item.quantity * item?.product?.price?.org).toFixed(2)}
                    </div>
                    <div className="table-item">
                      <DeleteOutline
                        sx={{ color: "red" }}
                        onClick={() =>
                          removeCart(
                            item?.product?._id,
                            item?.quantity - 1,
                            "full"
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="right">
                <div className="subtotal">
                  Subtotal : ${calculateSubtotal().toFixed(2)}
                </div>
                <div className="delivery">
                  Delivery Details:
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      <TextInput
                        small
                        placeholder="First Name"
                        value={deliveryDetails.firstName}
                        handelChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <TextInput
                        small
                        placeholder="Last Name"
                        value={deliveryDetails.lastName}
                        handelChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <TextInput
                      small
                      value={deliveryDetails.emailAddress}
                      handelChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          emailAddress: e.target.value,
                        })
                      }
                      placeholder="Email Address"
                    />
                    <TextInput
                      small
                      value={deliveryDetails.phoneNumber}
                      handelChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="Phone no. +91 XXXXX XXXXX"
                    />
                    <TextInput
                      small
                      textArea
                      rows="5"
                      handelChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          completeAddress: e.target.value,
                        })
                      }
                      value={deliveryDetails.completeAddress}
                      placeholder="Complete Address (Address, State, Country, Pincode)"
                    />
                  </div>
                </div>
                <div className="delivery">
                  Payment Details:
                  <div>
                    <TextInput small placeholder="Card Number" />
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      <TextInput small placeholder="Expiry Date" />
                      <TextInput small placeholder="CVV" />
                    </div>
                    <TextInput small placeholder="Card Holder name" />
                  </div>
                </div>
                <Button
                  text="Place Order"
                  small
                  isLoading={buttonLoad}
                  isDisabled={buttonLoad}
                  onClick={PlaceOrder}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
