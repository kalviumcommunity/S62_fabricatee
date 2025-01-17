import React, { useState, useMemo, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/filterBar";
import axios from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

function DesignsBrowse() {
  const [products, setProducts] = useState([]);
  const { auth } = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/design");
        setProducts(res.data.message);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleDeleteDesign = async (id) => {
    try {
      const res = await axios.delete(`/api/design/${id}`);
      if (!res.data.success) {
        throw Error(res.data.message);
      }
      console.log("design deleted");
      setProducts(prevProducts => prevProducts.filter(design => design._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Filter states
  const [activeGender, setActiveGender] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 800]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Derived values - moved inside useMemo to avoid errors with empty products array
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    const uniqueTags = [...new Set(products.flatMap((product) => product.tags))];
    const minPrice = Math.min(...products.map(p => p.stitching?.sp || 0));
    const maxPrice = Math.max(...products.map(p => p.stitching?.sp || 0));

    // Update price range if it hasn't been set by user interaction
    if (priceRange[0] === 0 && priceRange[1] === 800) {
      setPriceRange([minPrice, maxPrice]);
    }

    return products
      .filter(product => {
        // Safely handle missing or undefined values
        const productPrice = product.stitching?.sp || 0;
        const productTags = product.tags || [];
        const productRating = product.rating || 0;

        const matchesPrice = productPrice >= priceRange[0] && 
                           productPrice <= priceRange[1];
        
        const matchesGender = activeGender === "all" || 
                             productTags.includes(activeGender);
        
        const matchesCategories = selectedTags.length === 0 || 
                                 productTags.some(tag => selectedTags.includes(tag));
        
        const matchesRating = productRating >= minRating;

        return matchesPrice && matchesGender && matchesCategories && matchesRating;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return (a.stitching?.sp || 0) - (b.stitching?.sp || 0);
          case "price-desc":
            return (b.stitching?.sp || 0) - (a.stitching?.sp || 0);
          case "rating-desc":
            return (b.rating || 0) - (a.rating || 0);
          case "newest":
            return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
          default: // featured
            return 0;
        }
      });
  }, [products, priceRange, selectedTags, activeGender, minRating, sortBy]);

  // Calculate unique tags for FilterBar
  const uniqueTags = useMemo(() => {
    return [...new Set(products.flatMap((product) => product.tags || []))];
  }, [products]);

  // Calculate price range for FilterBar
  const { minPrice, maxPrice } = useMemo(() => ({
    minPrice: Math.min(...products.map(p => p.stitching?.sp || 0)),
    maxPrice: Math.max(...products.map(p => p.stitching?.sp || 0))
  }), [products]);

  return (
    <div className="flex w-full max-w-[100vw] min-h-[87vh] flex-col md:flex-row">
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

      <div className="flex bg-neutral items-start justify-center w-full">
        <div className="grid grid-cols-1 bg-neutral sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredProducts.map((product, index) => (
              <ProductCard
                key={product._id || index}
                title={product.name}
                mrp={product.stitching?.mrp}
                sp={product.stitching?.sp}
                url={product.images?.[0]?.url}
                btnTxt="Customize Now"
                onAddToCart={()=>{navigator(`./customize/${product._id}`)}}
                onUpdate={auth.loggedIn ? () => navigator(`/designform/${product._id}`) : undefined}
                onDelete={auth.loggedIn ? () => handleDeleteDesign(product._id) : undefined}
                priceType='design'
              />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesignsBrowse;