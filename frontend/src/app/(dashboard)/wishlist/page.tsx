"use client";
import Container from "@/components/ui/layout/container/Container";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import WishListCard from "./WishListCard";
import EmptyWishlist from "./EmptyWishlist";

const WishlistPage = () => {
  const wishlistItems = useAppSelector((state) => state.wishlist.products);

  return (
    <div>
      <Container>
        <div>
          <h1 className=" text-2xl font-bold">
            Wishlist ({wishlistItems.length})
          </h1>
          {wishlistItems.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className=" mt-10 grid md:grid-cols-3 xl:grid-cols-4 gap-5">
              {wishlistItems.map((dt: string) => (
                <WishListCard id={dt} key={dt} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default WishlistPage;
