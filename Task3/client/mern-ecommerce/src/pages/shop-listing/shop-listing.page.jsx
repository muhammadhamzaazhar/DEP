import React, { useEffect, useState } from "react";
import { CircularProgress, Slider } from "@mui/material";

import ProductCard from "../../components/product-card/product-card.component";
import { category, filter } from "../../utils/data";
import { getAllProducts } from "../../api/index";
import "./shop-listing.styles.css";

const ShopListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState(["S", "M", "L", "XL"]);
  const [selectedCategories, setSelectedCategories] = useState([
    "Men",
    "Women",
    "Kids",
    "Bags",
  ]);

  const getFilteredProductsData = async () => {
    setLoading(true);
    await getAllProducts(
      `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}${
        selectedSizes.length > 0 ? `&sizes=${selectedSizes.join(",")}` : ""
      }${
        selectedCategories.length > 0
          ? `&categories=${selectedCategories.join(",")}`
          : ""
      }`
    ).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getFilteredProductsData();
  }, [priceRange, selectedSizes, selectedCategories]);

  return (
    <div className={`container ${window.innerWidth < 768 ? "mobile" : ""}`}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div
            className={`filters ${window.innerWidth >= 768 ? "desktop" : ""}`}
          >
            <div className="menu">
              {filter.map((filters) => (
                <div className="filter-section">
                  <div className="title">{filters.name}</div>
                  {filters.value === "price" ? (
                    <>
                      <Slider
                        aria-label="Price"
                        defaultValue={priceRange}
                        min={0}
                        max={1000}
                        valueLabelDisplay="auto"
                        marks={[
                          { value: 0, label: "$0" },
                          { value: 1000, label: "$1000" },
                        ]}
                        onChange={(e, newValue) => setPriceRange(newValue)}
                      />
                    </>
                  ) : filters.value === "size" ? (
                    <div className="item">
                      {filters.items.map((item) => (
                        <div
                          key={item}
                          className={`selectable-item ${
                            selectedSizes.includes(item) ? "selected" : ""
                          }`}
                          onClick={() =>
                            setSelectedSizes((prevSizes) =>
                              prevSizes.includes(item)
                                ? prevSizes.filter((size) => size !== item)
                                : [...prevSizes, item]
                            )
                          }
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : filters.value === "category" ? (
                    <div className="item">
                      {filters.items.map((item) => (
                        <div
                          key={item}
                          className={`selectable-item ${
                            selectedCategories.includes(item) ? "selected" : ""
                          }`}
                          onClick={() =>
                            setSelectedCategories((prevCategories) =>
                              prevCategories.includes(item)
                                ? prevCategories.filter(
                                    (category) => category !== item
                                  )
                                : [...prevCategories, item]
                            )
                          }
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div
            className={`products ${window.innerWidth >= 768 ? "desktop" : ""}`}
          >
            <div
              className={`card-wrapper ${
                window.innerWidth < 768 ? "mobile" : ""
              }`}
            >
              {products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopListing;
