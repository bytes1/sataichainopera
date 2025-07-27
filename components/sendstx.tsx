"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { request } from "@stacks/connect";

type CryptosendProps = {
  address: string;
  amount: number;
};

// Animated STX Icon
const STXIcon = ({ isActive }: { isActive: boolean }) => (
  <div className="relative">
    <div
      className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center transition-all duration-700 ${
        isActive
          ? "rotate-12 scale-110 shadow-orange-500/50 shadow-2xl"
          : "rotate-0 scale-100"
      }`}
    >
      <svg
        className="w-8 h-8 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-10-5z" />
        <path
          d="M8 10h8M8 14h8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>

    {/* Orbiting particles */}
    {isActive && (
      <>
        {[0, 120, 240].map((rotation, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-spin opacity-80"
            style={{
              transform: `rotate(${rotation}deg) translateX(35px) rotate(-${rotation}deg)`,
              animationDuration: "3s",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </>
    )}

    {/* Pulse effect */}
    <div
      className={`absolute inset-0 rounded-2xl bg-orange-500/30 transition-all duration-1000 ${
        isActive ? "animate-ping scale-125" : "scale-100 opacity-0"
      }`}
    />
  </div>
);

// Transaction Status Indicator
const TransactionStatus = ({
  status,
}: {
  status: "idle" | "processing" | "success" | "error";
}) => {
  const statusConfig = {
    idle: {
      color: "text-slate-400",
      bg: "bg-slate-700/50",
      text: "Ready to Send",
    },
    processing: {
      color: "text-orange-400",
      bg: "bg-orange-900/30",
      text: "Processing...",
    },
    success: {
      color: "text-green-400",
      bg: "bg-green-900/30",
      text: "Transaction Sent!",
    },
    error: {
      color: "text-red-400",
      bg: "bg-red-900/30",
      text: "Transaction Failed",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-2 rounded-full ${config.bg} border border-white/10 transition-all duration-500`}
    >
      <div
        className={`w-2 h-2 rounded-full ${config.color.replace(
          "text-",
          "bg-"
        )} ${status === "processing" ? "animate-pulse" : ""}`}
      />
      <span className={`text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};

// Animated Address Display
const AddressDisplay = ({ address }: { address: string }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => setIsRevealed(!isRevealed)}
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 p-4 transition-all duration-500 hover:border-purple-400/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1 font-medium">
              Recipient Address
            </p>
            <p className="text-lg font-mono text-white transition-all duration-300">
              {isRevealed ? address : formatAddress(address)}
            </p>
          </div>

          <div className="text-purple-400 transition-transform duration-300 group-hover:scale-110">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isRevealed
                    ? "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                }
              />
            </svg>
          </div>
        </div>

        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
      </div>
    </div>
  );
};

// Enhanced Amount Display
const AmountDisplay = ({ amount }: { amount: number }) => {
  return (
    <div className="relative rounded-xl bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 p-4 overflow-hidden">
      <div className="relative z-10">
        <p className="text-xs text-green-400 mb-1 font-medium">
          Transaction Amount
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
            {amount.toLocaleString()}
          </span>
          <span className="text-lg text-green-300 font-bold">STX</span>
        </div>
        <p className="text-xs text-green-300/70 mt-1">
          ≈ ${(amount * 0.65).toFixed(2)} USD
        </p>
      </div>

      {/* Animated background effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-xl animate-pulse" />
    </div>
  );
};

// Enhanced Send Button
const SendButton = ({
  onClick,
  disabled,
  isProcessing,
}: {
  onClick: () => void;
  disabled: boolean;
  isProcessing: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isProcessing}
      className="group relative w-full overflow-hidden rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
    >
      {/* Animated gradient border */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          disabled
            ? "bg-gradient-to-r from-slate-600 to-slate-500"
            : "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 group-hover:from-orange-400 group-hover:via-pink-400 group-hover:to-purple-400"
        } ${!disabled && !isProcessing ? "animate-pulse" : ""}`}
      />

      <div
        className={`relative rounded-xl px-8 py-4 font-bold text-lg transition-all duration-300 ${
          disabled
            ? "bg-slate-700 text-slate-400"
            : "bg-slate-900 text-white group-hover:bg-slate-800"
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Processing Transaction...</span>
            </>
          ) : disabled ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Connect Wallet First</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span>Send STX Transaction</span>
            </>
          )}
        </div>
      </div>

      {/* Success ripple effect */}
      {!disabled && !isProcessing && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      )}
    </button>
  );
};

export const Sendstx = ({ address, amount }: CryptosendProps) => {
  const { isConnected, walletAddress } = useAuth();
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [isHovered, setIsHovered] = useState(false);

  async function handleSend() {
    setStatus("processing");

    try {
      const response = await request("stx_transferStx", {
        recipient: address,
        amount: amount.toString(),
        network: "testnet",
      });

      console.log("Transaction successful:", response);
      setStatus("success");

      // Reset to idle after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Error sending transaction:", error);
      setStatus("error");

      // Reset to idle after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 rounded-3xl blur opacity-20 animate-pulse" />

      {/* Main card */}
      <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl p-8 transition-all duration-500 hover:border-purple-400/50">
        {/* Floating particles */}
        {isHovered && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-bounce opacity-60"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 4) * 15}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <STXIcon isActive={isHovered || status === "processing"} />

          <div className="text-right">
            <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text">
              STX Transfer
            </h2>
            <TransactionStatus status={status} />
          </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-6 mb-8">
          <AddressDisplay address={address} />
          <AmountDisplay amount={amount} />
        </div>

        {/* Network Info */}
        <div className="flex items-center justify-between mb-6 px-4 py-2 rounded-xl bg-slate-800/30 border border-slate-700/30">
          <span className="text-sm text-slate-400">Network</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-orange-300">Testnet</span>
          </div>
        </div>

        {/* Send Button */}
        <SendButton
          onClick={handleSend}
          disabled={!isConnected}
          isProcessing={status === "processing"}
        />

        {/* Footer info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Transaction fees will be calculated automatically
          </p>
        </div>
      </div>
    </div>
  );
};

// Demo component
export default function Demo() {
  // Mock auth context for demo
  const mockAuth = {
    isConnected: true,
    walletAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
      <Sendstx
        address="ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
        amount={1500}
      />
    </div>
  );
}
