import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Rating } from "@mui/material";
import {
  AddShoppingCartOutlined,
  FavoriteBorder,
  FavoriteRounded,
} from "@mui/icons-material";

import {
  addToCart,
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
} from "../../api/index";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import "./product-card.styles.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

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
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: product?._id, quantity: 1 })
      .then((res) => {
        navigate("/cart");
      })
      .catch((err) => {
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
    checkFavourite();
  }, []);

  return (
    <div className="card">
      <div className="top">
        <img src={product?.img} className="image" />
        <div className="menu">
          <div
            className="menu-item"
            onClick={() => (favorite ? removeFavorite() : addFavorite())}
          >
            {favoriteLoading ? (
              <CircularProgress sx={{ fontSize: "20px" }} />
            ) : (
              <>
                {favorite ? (
                  <FavoriteRounded sx={{ fontSize: "20px", color: "red" }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: "20px" }} />
                )}
              </>
            )}
          </div>
          <div className="menu-item" onClick={() => addCart(product?.id)}>
            <AddShoppingCartOutlined
              sx={{ color: "inherit", fontSize: "20px" }}
            />
          </div>
        </div>
        <div className="rate">
          <Rating value={3.5} sx={{ fontSize: "14px" }} />
        </div>
      </div>
      <div className="details" onClick={() => navigate(`/shop/${product._id}`)}>
        <div className="title">{product?.title}</div>
        <div className="desc">{product?.name}</div>
        <div className="price">
          ${product?.price?.org}{" "}
          <div className="span">${product?.price?.mrp}</div>
          <div className="percent">${product?.price?.off}% Off</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
