"use client";

import { motion } from "framer-motion";
import { FaBitcoin } from "react-icons/fa";

type CryptoPrice = {
  date: string;
  price: number;
};

type CryptoProps = {
  symbol: string;
  prices: CryptoPrice[];
};

export const CryptoPriceHistory = ({ symbol, prices }: CryptoProps) => {
  return (
    <motion.div
      className="max-w-lg mx-auto rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl p-8 text-white transform transition-all duration-500 hover:scale-105 hover:shadow-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      role="region"
      aria-label={`Historical price data for ${symbol}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">
          {symbol.toUpperCase()} Price History
        </h2>
        <FaBitcoin className="text-4xl text-yellow-400" aria-hidden="true" />
      </div>
      <div className="space-y-4">
        {prices.map((entry, index) => (
          <motion.div
            key={entry.date}
            className="flex items-center justify-between bg-black bg-opacity-20 rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <span className="text-lg font-medium text-gray-200">
              {new Date(entry.date).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </span>
            <span className="text-lg font-bold text-green-400">
              $
              {entry.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-300">
          Data as of{" "}
          {new Date().toLocaleDateString("en-US", { dateStyle: "medium" })}
        </p>
      </div>
    </motion.div>
  );
};
