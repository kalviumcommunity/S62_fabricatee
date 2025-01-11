// Fabrics.jsx
import React, { useState, useMemo, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/filterBar";
import axios from "@/api/axios";
import logo from "@/assets/logo.png"
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Fabrics() {
  const [products, setProducts] = useState([]);
  const {auth} = useAuth();
  const navigator = useNavigate();

  useEffect(()=>{

    const fetchData = async () =>{
      await axios.get("/api/fabric")
        .then((res)=>{
          setProducts(res.data.message);
          console.log(products);
          console.log(products.images[0])
        })
        .catch((err)=>{
          console.log(err);
        })
    }
    fetchData();
  }, []);

  // Filter states
  const [activeGender, setActiveGender] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 800]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Derived values
  const uniqueTags = [...new Set(products.flatMap((product) => product.tags))];
  const minPrice = Math.min(...products.map(p => p.meterprice.sp));
  const maxPrice = Math.max(...products.map(p => p.meterprice.sp));

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filt = products
      .filter(product => {
        const matchesPrice = product.meterprice.sp >= priceRange[0] && 
                           product.meterprice.sp <= priceRange[1];
        const matchesGender = activeGender=="all" || product.tags.includes(activeGender);
        const matchesCategories = selectedTags.length === 0 || 
                                 product.tags.some(tag => selectedTags.includes(tag));
        const matchesRating = (product.rating||0) >= minRating;
  
        return matchesPrice && matchesGender && matchesCategories && matchesRating;
        // return matchesPrice && matchesGender && matchesCategories;
      })
      .sort((a, b) => {
        // ... sorting logic remains the same
        switch (sortBy) {
          case "price-asc":
            return a.meterprice.sp - b.meterprice.sp;
          case "price-desc":
            return b.meterprice.sp - a.meterprice.sp;
          case "rating-desc":
            return b.rating - a.rating;
          case "newest":
            return new Date(b.dateAdded) - new Date(a.dateAdded);
          default: // featured
            return 0;
        }
      });
      console.log("filt", filt);
      return filt;
  }, [products, priceRange, selectedTags, activeGender, minRating, sortBy]);

  return (
    <div className="flex w-full max-w-[100vw] min-h-[87vh] flex-col md:flex-row">
      {/* Filter Sidebar */}
      <div className="bg-neutral flex p-4">
        <FilterBar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          activeGender={activeGender}
          setActiveGender={setActiveGender}
          sortBy={sortBy}
          setSortBy={setSortBy}
          minPrice={minPrice}
          maxPrice={maxPrice}
          tags={uniqueTags}
          ratings={minRating}
          setMinRating={setMinRating}
        />
      </div>

      {/* Product Grid */}
      <div className="flex bg-neutral items-start justify-center w-full">
        <div className="grid grid-cols-1 bg-neutral sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={index}
                title={product.name}
                rating={product.rating||0}
                mrp={product.meterprice.mrp}
                sp={product.meterprice.sp}
                url={
                    product.images && product.images.length > 0 && product.images[0].url
                    ? product.images[0].url
                    : logo
                }

                onUpdate={(auth.loggedIn)?()=>{navigator(`/fabricform/${product._id}`)}:undefined}
                onDelete={(auth.loggedIn)?()=>{console.log("Update", product._id)}:undefined}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Fabrics;