import React from "react";
import { useNavigate } from "react-router-dom";
import "./product-category-card.styles.css";

const ProductCategoryCard = ({ category }) => {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      onClick={() => navigate(`/shop?category=${category.name}`)}
    >
      <div className="top">
        <img src={category.img} className="image" />
        <div className="menu">
          <div className="button">{category.name}</div>
        </div>
        <div className="sale">{category.off}</div>
      </div>
    </div>
  );
};

export default ProductCategoryCard;
