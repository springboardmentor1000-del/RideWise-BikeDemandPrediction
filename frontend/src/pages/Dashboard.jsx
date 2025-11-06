import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import '../index.css';

import scooterImg from "../assets/scooter.png";
import standardImg from "../assets/standard.png";
import cruiserImg from "../assets/cruiser.png";
import adventureImg from "../assets/adventure.png";
import bikePoster from "../assets/dsb.png";

export default function Dashboard() {
  const features = [
    {
      title: "Complementary Helmet",
      desc: "Your safety is our priority. We provide helmets with every ride.",
    },
    {
      title: "Zero Deposit",
      desc: "Pay only for what you use. No deposit required!",
    },
    {
      title: "Lowest Price Guarantee",
      desc: "Count on us for the best rental prices in the city.",
    },
  ];

  const steps = [
    { title: "Set the Date", desc: "Pick your ride date and search for your desired bike." },
    { title: "Choose Your Bike", desc: "Select the one that best fits your trip style and comfort." },
    { title: "Pick-Up Location", desc: "Head to the nearest station to grab your ride." },
    { title: "Enjoy the Ride", desc: "Hit the road and make memories along the way!" },
  ];

  const [stats, setStats] = useState({
    bikes: 0,
    downloads: 0,
    locations: 0,
    kms: 0,
  });

  useEffect(() => {
    setStats({
      bikes: Math.floor(Math.random() * 9000) + 1000,
      downloads: Math.floor(Math.random() * 900000) + 100000,
      locations: Math.floor(Math.random() * 40) + 5,
      kms: Math.floor(Math.random() * 90000000) + 10000000,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white px-8 py-16">

      {/* ---------- HEADER POSTER IMAGE ---------- */}
      <div className="flex justify-center items-center mb-20 w-full">
        <motion.img
          src={bikePoster}
          alt="Ride Beyond Limits Poster"
          className="w-full h-auto object-cover rounded-none border-b border-orange-700"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>

      {/* ---------- WHY CHOOSE SECTION ---------- */}


<section className="py-16 bg-black text-white overflow-hidden">
  <h2 className="text-4xl font-bold text-center text-orange-500 mb-4">
    Why Choose RideWise?
  </h2>
  <p className="text-center text-gray-400 mb-12">
    Rent smarter. Ride safer. Dominate every road.
  </p>

  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 px-6">
    {/* Left image with inside-out animation */}
    <motion.div
      className="flex justify-center items-center"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <img
        src="/src/assets/boongg.png"
        alt="Black Scooter"
        className="rounded-lg shadow-lg w-full max-w-md"
      />
    </motion.div>

    {/* Right info boxes sliding from right */}
    <motion.div
      className="grid sm:grid-cols-2 gap-6"
      initial={{ x: 150, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="p-6 bg-orange-600 text-black rounded-lg shadow-lg border border-orange-400">
        <h3 className="text-lg font-bold mb-2">Complementary Helmet</h3>
        <p>Your safety is our priority. We provide helmets with every ride.</p>
      </div>

      <div className="p-6 bg-orange-600 text-black rounded-lg shadow-lg border border-orange-400">
        <h3 className="text-lg font-bold mb-2">Zero Deposit</h3>
        <p>Pay only for what you use. No deposit required!</p>
      </div>

      <div className="p-6 bg-orange-600 text-black rounded-lg shadow-lg border border-orange-400">
        <h3 className="text-lg font-bold mb-2">Lowest Price Guarantee</h3>
        <p>Count on us for the best rental prices in the city.</p>
      </div>

      <div className="p-6 bg-orange-600 text-black rounded-lg shadow-lg border border-orange-400">
        <h3 className="text-lg font-bold mb-2">24/7 Roadside Assistance</h3>
        <p>Ride with confidence. We’re just a call away anytime you need help.</p>
      </div>
    </motion.div>
  </div>
</section>



      {/* ---------- DIVIDER ---------- */}
      <div className="border-t border-orange-800 my-20 w-2/3 mx-auto"></div>

      {/* ---------- EXCLUSIVE DEALS ---------- */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-4xl font-extrabold text-orange-500 mb-6">
          Exclusive Deals
        </h2>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          spaceBetween={40}
          slidesPerView={3}
          className="pb-12"
        >
          {[
            { img: scooterImg, title: "Scooter", price: "₹30/hour" },
            { img: adventureImg, title: "Adventure Bike", price: "₹45/hour" },
            { img: standardImg, title: "Standard Bike", price: "₹40/hour" },
            { img: cruiserImg, title: "Cruiser", price: "₹50/hour" },
          ].map((bike, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center bg-black border border-orange-700 p-6 rounded-xl hover:shadow-[0_0_40px_rgba(255,150,0,0.6)] hover:scale-105 transition-all duration-500">
                <img
                  src={bike.img}
                  alt={bike.title}
                  className="w-72 h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-semibold text-orange-400 mb-1">
                  {bike.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  Rent starting from {bike.price}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ---------- HOW IT WORKS ---------- */}
      <div className="border-t border-orange-800 my-20 w-2/3 mx-auto"></div>
      <div className="max-w-7xl mx-auto text-center pb-20">
        <h2 className="text-4xl font-extrabold text-orange-500 mb-3">
          How It Works?
        </h2>
        <p className="text-gray-400 mb-12 text-lg">
          Get your dream ride in just a few steps.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className="bg-black border border-orange-600 rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,140,0,0.4)] transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-300 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- STATS SECTION ---------- */}
      <div className="bg-black/90 py-20 border-t border-orange-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <h2 className="text-5xl font-bold text-orange-500">
              {stats.bikes.toLocaleString()}+
            </h2>
            <p className="text-gray-400 mt-2">Total Two-Wheelers</p>
          </div>
          <div>
            <h2 className="text-5xl font-bold text-orange-500">
              {stats.kms.toLocaleString()}+
            </h2>
            <p className="text-gray-400 mt-2">KMs Driven</p>
          </div>
          <div>
            <h2 className="text-5xl font-bold text-orange-500">
              {stats.downloads.toLocaleString()}+
            </h2>
            <p className="text-gray-400 mt-2">App Downloads</p>
          </div>
          <div>
            <h2 className="text-5xl font-bold text-orange-500">
              {stats.locations}
            </h2>
            <p className="text-gray-400 mt-2">Total Locations</p>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-10">
        © 2025 RideWise. All rights reserved.
      </p>
    </div>
  );
}
