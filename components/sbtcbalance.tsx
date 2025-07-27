"use client";

import React from "react";

export type TokenBalance = {
  token: string;
  balance: string;
  rawBalance: string;
  contractId: string;
};

type SbtcBalanceCardProps = {
  balances: TokenBalance[] | string;
};

export const SbtcBalance = ({ balances }: SbtcBalanceCardProps) => {
  console.log("balances", balances);
  /* ---------- Empty state ---------- */
  if (typeof balances === "string") {
    return (
      <div className="min-h-[10rem] flex items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-center shadow-xl ring-1 ring-slate-700">
          <p className="text-slate-300 text-lg font-medium">{balances}</p>
        </div>
      </div>
    );
  }

  /* ---------- Token list ---------- */
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {balances.map((b, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 shadow-xl ring-1 ring-slate-700/50 transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-purple-500/70"
        >
          {/* subtle animated bg */}
          <div className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-t from-purple-600/20 to-transparent transition-transform duration-500 group-hover:translate-y-0" />

          <div className="relative z-10 flex flex-col">
            <span className="mb-1 text-xs uppercase tracking-widest text-purple-400">
              Token
            </span>
            <span className="truncate font-bold text-xl text-white">
              {b.token}
            </span>

            <span className="mt-3 text-xs uppercase tracking-widest text-purple-400">
              Balance
            </span>
            <span className="text-2xl font-mono font-semibold text-green-400">
              {b.balance}
            </span>

            <span className="mt-4 text-xs text-slate-400 truncate">
              {b.contractId}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
