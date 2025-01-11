import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const FilterBar = ({
  priceRange,
  setPriceRange,
  selectedTags,
  setSelectedTags,
  activeGender,
  setActiveGender,
  sortBy,
  setSortBy,
  minPrice,
  maxPrice,
  tags,
  ratings,
  setMinRating,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="top-20 w-full ">
      {/* Mobile Filter Button */}
      <div className="md:hidden px-4 flex flex-row justify-between">
        <Button onClick={() => setIsFilterOpen(true)}>Filters</Button>
        <div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Slide-out Filter Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:z-[5] bg-white shadow-lg w-72 p-5 rounded-md space-y-8 transform transition-transform ${
          isFilterOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:sticky md:-top-14 md:left-0`}
      >
        <button
          className="block md:hidden mb-4 text-left"
          onClick={() => setIsFilterOpen(false)}
        >
          ✕ Close Filters
        </button>

        <div className="invisible hidden md:visible md:block !mt-0 space-y-2">
            <h3 className="font-medium text-sm">Sort By</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <Separator className="invisible hidden md:visible md:block h-[3px]"/>

        {/* Price Range Filter */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Price Range</h3>
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            max={maxPrice}
            min={minPrice}
            step={50}
            onValueChange={(value) => setPriceRange(value)}
            className="mt-2"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">₹{priceRange[0]}</span>
            <span className="text-sm text-muted-foreground">₹{priceRange[1]}</span>
          </div>
        </div>

        <Separator />

        {/* Gender Filter */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Gender</h3>
          <Select value={activeGender} onValueChange={setActiveGender}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="mens">Men</SelectItem>
              <SelectItem value="womens">Women</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator/>

        {/* Category Filter */}
        <div className="space-y-4">
            <h3 className="font-medium text-sm">Categories</h3>
            <div className="space-y-2">
            {tags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                    id={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                    if (checked) {
                        setSelectedTags([...selectedTags, tag]);
                    } else {
                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                    }
                    }}
                />
                <label
                    htmlFor={tag}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </label>
                </div>
            ))}
            </div>
        </div>
    

        <Separator />

        {/* Rating Filter */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Minimum Rating</h3>
          <Select
            value={String(ratings)}
            onValueChange={(value) => setMinRating(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Ratings</SelectItem>
              <SelectItem value="4">4★ & above</SelectItem>
              <SelectItem value="3">3★ & above</SelectItem>
              <SelectItem value="2">2★ & above</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Background Overlay for Sidebar */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default FilterBar;
