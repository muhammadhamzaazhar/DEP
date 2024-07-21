import React, { useEffect, useState } from "react";

import { category } from "../../utils/data";
import ProductCategoryCard from "../../components/product-category-card/product-category-card.component";
import ProductCard from "../../components/product-card/product-card.component";
import { getAllProducts } from "../../api/index";
import HeaderImage from "../../utils/Images/Header.png";
import "./home.styles.css";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    setLoading(true);
    await getAllProducts().then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container">
      <div className="section center">
        <img className="img" src={HeaderImage} alt="Header" />
      </div>
      <div className="section">
        <div className="title">Shop by Categories</div>
        <div className="card-wrapper">
          {category.map((category) => (
            <ProductCategoryCard category={category} key={category.id} />
          ))}
        </div>
      </div>
      <div className="section">
        <div className="title center">Our Bestseller</div>
        <div className="card-wrapper">
          {products.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
