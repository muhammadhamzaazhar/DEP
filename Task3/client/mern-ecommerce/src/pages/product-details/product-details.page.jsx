import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Rating } from "@mui/material";
import { FavoriteBorder, FavoriteRounded } from "@mui/icons-material";

import Button from "../../components/button/button.component";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import {
  addToCart,
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
  getProductDetails,
} from "../../api/index";
import "./product-details.styles.css";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();
  const [selected, setSelected] = useState();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const getProduct = async () => {
    setLoading(true);
    await getProductDetails(id).then((res) => {
      setProduct(res.data);
      setLoading(false);
    });
  };

  const addFavorite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await addToFavourite(token, { productID: product?._id })
      .then((res) => {
        setFavorite(true);
        setFavoriteLoading(false);
      })
      .catch((err) => {
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const removeFavorite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await deleteFromFavourite(token, { productID: product?._id })
      .then((res) => {
        setFavorite(false);
        setFavoriteLoading(false);
      })
      .catch((err) => {
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const addCart = async () => {
    setCartLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: product?._id, quantity: 1 })
      .then((res) => {
        setCartLoading(false);
        navigate("/cart");
      })
      .catch((err) => {
        setCartLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const checkFavourite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await getFavourite(token, { productId: product?._id })
      .then((res) => {
        const isFavorite = res.data?.some(
          (favorite) => favorite._id === product?._id
        );
        setFavorite(isFavorite);
        setFavoriteLoading(false);
      })
      .catch((err) => {
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  useEffect(() => {
    getProduct();
    checkFavourite();
  }, []);

  return (
    <div className="container">
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="wrapper">
          <div className="image-wrapper">
            <img className="image" src={product?.img} alt={product?.title} />
          </div>
          <div className="details">
            <div>
              <div className="title">{product?.title}</div>
              <div className="name">{product?.name}</div>
            </div>
            <Rating value={3.5} />
            <div className="price">
              ${product?.price?.org}{" "}
              <div className="span">${product?.price?.mrp}</div>
              <div className="percent">(${product?.price?.off}% Off)</div>
            </div>
            <div className="desc">{product?.desc}</div>
            <div className="sizes">
              <div className="items">
                {product?.sizes.map((size) => (
                  <div
                    className={`item ${selected === size ? "selected" : ""}`}
                    onClick={() => setSelected(size)}
                    key={size}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
            <div className="button-wrapper">
              <Button
                text="Add to Cart"
                full
                outlined
                isLoading={cartLoading}
                onClick={() => addCart()}
              />
              <Button text="Buy Now" full />
              <Button
                leftIcon={
                  favorite ? (
                    <FavoriteRounded sx={{ fontSize: "22px", color: "red" }} />
                  ) : (
                    <FavoriteBorder sx={{ fontSize: "22px" }} />
                  )
                }
                full
                outlined
                isLoading={favoriteLoading}
                onClick={() => (favorite ? removeFavorite() : addFavorite())}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
