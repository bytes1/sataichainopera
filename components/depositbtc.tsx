"use client";

import { Cl, PostConditionMode, Pc } from "@stacks/transactions";
import { openContractCall, openSTXTransfer } from "@stacks/connect";
import { useAuth } from "@/contexts/auth-context";
import { request } from "@stacks/connect";
import { buildSbtcDepositAddress, SbtcApiClientTestnet, TESTNET } from "sbtc";
import { useState, useEffect } from "react";

type CryptosendProps = {
  amount: number;
};

export const Depositbtc = ({ amount }: CryptosendProps) => {
  const { isConnected, walletAddress } = useAuth();
  const [depositAddress, setDepositAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const client = new SbtcApiClientTestnet();

  async function createDepositAddress() {
    if (!walletAddress) return;

    setIsGenerating(true);
    try {
      const deposit = await buildSbtcDepositAddress({
        network: TESTNET,
        stacksAddress: walletAddress,
        signersPublicKey: await client.fetchSignersPublicKey(),
        reclaimPublicKey:
          "062bd2c825300d74f4f9feb6b2fec2590beac02b8938f0fc042a34254581ee69",
      });
      setDepositAddress(deposit);
    } catch (error) {
      console.error("Error creating deposit address:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    if (isConnected && walletAddress) {
      createDepositAddress();
    }
  }, [isConnected, walletAddress]);

  const copyToClipboard = async () => {
    if (depositAddress) {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  async function handleSend() {
    setIsLoading(true);
    // Add your deposit logic here
    setTimeout(() => setIsLoading(false), 2000);
  }

  return (
    <div className="relative max-w-lg mx-auto">
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 rounded-3xl blur opacity-25 animate-pulse"></div>

      {/* Main card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-orange-900/10 to-slate-900 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Header with Bitcoin icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <div className="text-2xl font-bold text-white">₿</div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent">
            BTC Deposit
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Generate your sBTC deposit address
          </p>
        </div>

        {/* Deposit details */}
        <div className="space-y-6 mb-8">
          {/* Generated Address */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                Deposit Address
              </div>
              {depositAddress && (
                <button
                  onClick={copyToClipboard}
                  className="text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-2 py-1 rounded-lg transition-colors duration-200 flex items-center gap-1"
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
              )}
            </div>

            {isGenerating ? (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-5 h-5 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"></div>
                  <span className="text-sm">Generating address...</span>
                </div>
              </div>
            ) : depositAddress ? (
              <div className="text-white font-mono text-sm break-all bg-black/20 rounded-lg p-3 border border-white/5 leading-relaxed">
                {depositAddress}
              </div>
            ) : (
              <div className="text-gray-500 text-sm py-4 text-center">
                Connect wallet to generate deposit address
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Deposit Amount
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {amount.toLocaleString()}
              </span>
              <span className="text-gray-400 text-sm">BTC</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 rounded-2xl p-4 border border-blue-500/20">
            <div className="text-sm text-blue-300 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Instructions
            </div>
            <ul className="text-sm text-blue-200/80 space-y-1">
              <li>1. Copy the generated deposit address</li>
              <li>2. Send BTC from your Bitcoin wallet to this address</li>
              <li>3. Wait for confirmation to receive sBTC</li>
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {/* Generate new address button */}
          <button
            onClick={createDepositAddress}
            disabled={!isConnected || isGenerating}
            className={`
              w-full rounded-2xl py-3 px-6 font-semibold text-sm
              transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
              ${
                !isConnected || isGenerating
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30"
              }
            `}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating...
              </div>
            ) : (
              "🔄 Generate New Address"
            )}
          </button>

          {/* Main action button */}
          <button
            onClick={handleSend}
            disabled={!isConnected || !depositAddress || isLoading}
            className={`
              w-full relative overflow-hidden rounded-2xl py-4 px-6 font-semibold text-lg
              transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
              shadow-lg hover:shadow-xl
              ${
                !isConnected || !depositAddress
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed shadow-gray-600/20"
                  : "bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white shadow-orange-500/30 hover:shadow-orange-500/40"
              }
            `}
          >
            {/* Button background animation */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 transition-opacity duration-300 ${
                !isConnected || !depositAddress || isLoading
                  ? ""
                  : "hover:opacity-20"
              }`}
            ></div>

            {/* Button content */}
            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : !isConnected ? (
                <>
                  <div className="w-5 h-5 text-gray-300">⚠</div>
                  <span>Connect Wallet First</span>
                </>
              ) : !depositAddress ? (
                <>
                  <div className="w-5 h-5 text-gray-300">⏳</div>
                  <span>Generate Address First</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 text-white">↓</div>
                  <span>Initiate Deposit</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Status indicator */}
        {isConnected && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Wallet Connected
            </div>
          </div>
        )}
      </div>

      {/* Floating Bitcoin symbols */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
        <div
          className="absolute top-1/4 left-1/4 text-orange-400/20 text-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        >
          ₿
        </div>
        <div
          className="absolute top-3/4 right-1/4 text-yellow-400/15 text-sm animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        >
          ₿
        </div>
        <div
          className="absolute bottom-1/3 left-1/3 text-orange-400/25 text-lg animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        >
          ₿
        </div>
      </div>
    </div>
  );
};
