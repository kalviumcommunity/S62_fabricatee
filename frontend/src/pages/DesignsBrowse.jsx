// DesignsBrowse.jsx
import React, { useState, useMemo, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/filterBar";
import axios from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

function DesignsBrowse() {
  const [products, setProducts] = useState([]);
  const {auth} = useAuth();
  const navigator = useNavigate();

  useEffect(()=>{

    const fetchData = async () =>{
      await axios.get("/api/design")
        .then((res)=>{
          setProducts(res.data.message);
          console.log("fetched", products)
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
  const minPrice = Math.min(...products.map(p => p.stitching.sp));
  const maxPrice = Math.max(...products.map(p => p.stitching.sp));

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filt = products
      .filter(product => {
        const matchesPrice = product.stitching.sp >= priceRange[0] && 
                           product.stitching.sp <= priceRange[1];
        const matchesGender = activeGender=="all" || product.tags.includes(activeGender);
        const matchesCategories = selectedTags.length === 0 || 
                                 product.tags.some(tag => selectedTags.includes(tag));
        const matchesRating = product.rating >= minRating;
  
        return matchesPrice && matchesGender && matchesCategories && matchesRating;
      })
      .sort((a, b) => {
        // ... sorting logic remains the same
        switch (sortBy) {
          case "price-asc":
            return a.stitching.sp - b.stitching.sp;
          case "price-desc":
            return b.stitching.sp - a.stitching.sp;
          case "rating-desc":
            return b.rating - a.rating;
          case "newest":
            return new Date(b.dateAdded) - new Date(a.dateAdded);
          default: // featured
            return 0;
        }
      });
      console.log(filt);
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

      {/* fix filtering */}

      {/* Product Grid */}
      <div className="flex bg-neutral items-start justify-center w-full">
        <div className="grid grid-cols-1 bg-neutral sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                title={product.name}
                // rating={0}
                mrp={product.stitching.mrp}
                sp={product.stitching.sp}
                url={product.images[0].url}
                
                onUpdate={(auth.loggedIn)?()=>{navigator(`/designform/${product._id}`)}:undefined}
                onDelete={(auth.loggedIn)?()=>{console.log("Update", product._id)}:undefined}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default DesignsBrowse;