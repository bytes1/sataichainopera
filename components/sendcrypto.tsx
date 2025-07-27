"use client";

import { Cl, PostConditionMode, Pc } from "@stacks/transactions";
import { openContractCall, openSTXTransfer } from "@stacks/connect";
import { useAuth } from "@/contexts/auth-context";
import { request } from "@stacks/connect";
import { useState } from "react";

type CryptosendProps = {
  address: string;
  amount: number;
};

export const Cryptosend = ({ address, amount }: CryptosendProps) => {
  const { isConnected, walletAddress } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSend() {
    if (!isConnected) return;

    setIsLoading(true);
    let pc = Pc.principal(walletAddress)
      .willSendEq(amount)
      .ft("ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token", "sbtc-token");

    try {
      const response = await request("stx_callContract", {
        contract: "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token",
        functionName: "transfer",
        functionArgs: [
          Cl.uint(amount),
          Cl.standardPrincipal(walletAddress),
          Cl.standardPrincipal(address),
          Cl.some(Cl.bufferFromUtf8(`${22}☕️${22}`)),
        ],
        postConditions: [pc],
        postConditionMode: "deny",
        network: "testnet",
      });

      console.log("Transaction successful:", response);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error sending transaction:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative max-w-md mx-auto">
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30 animate-pulse"></div>

      {/* Main card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Header with crypto icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <div className="text-2xl">₿</div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            SBTC Transfer
          </h2>
        </div>

        {/* Transaction details */}
        <div className="space-y-6 mb-8">
          {/* Recipient */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Recipient Address
            </div>
            <div className="text-white font-mono text-sm break-all bg-black/20 rounded-lg p-3 border border-white/5">
              {address}
            </div>
          </div>

          {/* Amount */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Amount
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {amount.toLocaleString()}
              </span>
              <span className="text-gray-400 text-sm">SBTC</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleSend}
          disabled={!isConnected || isLoading}
          className={`
            w-full relative overflow-hidden rounded-2xl py-4 px-6 font-semibold text-lg
            transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            shadow-lg hover:shadow-xl
            ${
              !isConnected
                ? "bg-gray-600 text-gray-300 cursor-not-allowed shadow-gray-600/20"
                : isSuccess
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30"
                : "bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-purple-500/30 hover:shadow-purple-500/40"
            }
          `}
        >
          {/* Button background animation */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 transition-opacity duration-300 ${
              !isConnected || isLoading ? "" : "hover:opacity-20"
            }`}
          ></div>

          {/* Button content */}
          <div className="relative flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : isSuccess ? (
              <>
                <div className="w-5 h-5 text-white">✓</div>
                <span>Transaction Sent!</span>
              </>
            ) : !isConnected ? (
              <>
                <div className="w-5 h-5 text-gray-300">⚠</div>
                <span>Connect Wallet First</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 text-white">→</div>
                <span>Send Transaction</span>
              </>
            )}
          </div>
        </button>

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

      {/* Floating particles effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
      </div>
    </div>
  );
};
