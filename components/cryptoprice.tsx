"use client";

import { useState, useEffect } from "react";

type StockProps = {
  price: number;
  symbol: string;
};

// Enhanced animated icon with pulsing effect
const CryptoIcon = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative">
    {/* Animated ring */}
    <div
      className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-700 ${
        isHovered ? "animate-spin scale-110 opacity-80" : "scale-100 opacity-60"
      }`}
      style={{ animationDuration: "3s" }}
    />

    {/* Main icon container */}
    <div
      className={`relative w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
        isHovered ? "scale-110 shadow-purple-500/50" : "scale-100"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-white transition-all duration-500 ${
          isHovered ? "scale-110" : "scale-100"
        }`}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>

      {/* Glowing dot */}
      <div
        className={`absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg ${
          isHovered ? "animate-pulse" : ""
        }`}
      >
        <div className="w-full h-full rounded-full bg-white/30 animate-ping" />
      </div>
    </div>
  </div>
);

// Animated price counter
const AnimatedPrice = ({ price }: { price: number }) => {
  const [displayPrice, setDisplayPrice] = useState(price);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setDisplayPrice(price);
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [price]);

  return (
    <p
      className={`text-6xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent transition-all duration-500 ${
        isAnimating ? "scale-105 blur-[1px]" : "scale-100 blur-0"
      }`}
    >
      ${displayPrice.toLocaleString()}
    </p>
  );
};

// Enhanced chart with multiple layers
const AnimatedChart = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative mt-8 overflow-hidden rounded-xl">
    {/* Background glow */}
    <div
      className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl transition-opacity duration-700 ${
        isHovered ? "opacity-100" : "opacity-50"
      }`}
    />

    <svg
      className="relative w-full h-20 text-emerald-400"
      fill="none"
      viewBox="0 0 400 80"
    >
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d="M0 60 C50 45, 100 25, 150 35 C200 45, 250 30, 300 25 C350 20, 380 15, 400 10 L400 80 L0 80 Z"
        fill="url(#chartGradient)"
        className="transition-all duration-1000"
      />

      {/* Main line */}
      <path
        d="M0 60 C50 45, 100 25, 150 35 C200 45, 250 30, 300 25 C350 20, 380 15, 400 10"
        stroke="url(#lineGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-1000 ${
          isHovered ? "stroke-[4px]" : "stroke-[3px]"
        }`}
        style={{
          filter: isHovered ? "drop-shadow(0 0 8px currentColor)" : "none",
        }}
      />

      {/* Data points */}
      {[0, 150, 300, 400].map((x, i) => {
        const y = [60, 35, 25, 10][i];
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isHovered ? "4" : "3"}
            fill="url(#lineGradient)"
            className="transition-all duration-300"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          />
        );
      })}
    </svg>
  </div>
);

export const Crypto = ({ price, symbol }: StockProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className="relative w-full max-w-sm group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Animated background gradient */}
      <div
        className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-all duration-700 group-hover:blur-xl"
        style={{
          background: isHovered
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, #06b6d4, #8b5cf6, #ec4899)`
            : undefined,
        }}
      />

      {/* Main card */}
      <div className="relative rounded-3xl border border-white/20 bg-slate-900/60 p-8 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-purple-500/20">
        {/* Floating particles effect */}
        {isHovered && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-bounce opacity-60"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <CryptoIcon isHovered={isHovered} />

          <div className="text-right">
            <span className="font-mono text-2xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              {symbol}
            </span>
            <div className="flex items-center justify-end mt-1 space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-semibold">LIVE</span>
            </div>
          </div>
        </div>

        {/* Price section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <p className="text-sm text-slate-300 font-medium tracking-wide">
              Current Price
            </p>
          </div>

          <AnimatedPrice price={price} />
        </div>

        {/* Enhanced chart */}
        <AnimatedChart isHovered={isHovered} />
      </div>
    </div>
  );
};

// Demo component
export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
      <Crypto price={45678} symbol="BTC" />
    </div>
  );
}
