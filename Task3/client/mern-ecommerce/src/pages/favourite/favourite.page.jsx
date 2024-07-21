import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

import ProductCard from "../../components/product-card/product-card.component";
import { getFavourite } from "../../api/index";
import "./favourite.styles.css";

const Favourite = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await getFavourite(token).then((res) => {
      setProducts(res.data);
      setLoading(false);
      setReload(!reload);
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container">
      <div className="section">
        <div className="title">Your favourites</div>
        <div className="card-wrapper">
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {products.length === 0 ? (
                <>No Products</>
              ) : (
                <div className="card-wrapper">
                  {products.map((product) => (
                    <ProductCard product={product} key={product._id} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favourite;
