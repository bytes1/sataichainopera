"use client";

import { useState, useEffect } from "react";
import type { Message } from "ai";
import { Crypto } from "./cryptoprice";
import { Cryptosend } from "./sendcrypto";
import { Depositbtc } from "./depositbtc";
import { Sendstx } from "./sendstx";
import { SbtcBalance } from "./sbtcbalance";
import { CryptoPriceHistory } from "./CryptoPriceHistory";

// Enhanced Avatar Component
const Avatar = ({
  role,
  isTyping = false,
}: {
  role: string;
  isTyping?: boolean;
}) => {
  const isUser = role === "user";

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-105"
            : "bg-gradient-to-br from-emerald-500 to-teal-600 hover:scale-105"
        }`}
      >
        {isUser ? (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>

      {/* Online/Active indicator */}
      <div
        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 transition-all duration-300 ${
          isUser
            ? "bg-blue-400"
            : isTyping
            ? "bg-orange-400 animate-pulse"
            : "bg-green-400"
        }`}
      />

      {/* Typing animation rings */}
      {!isUser && isTyping && (
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 animate-ping" />
          <div
            className="absolute inset-1 rounded-xl bg-emerald-400/10 animate-ping"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      )}
    </div>
  );
};

// Enhanced Loading Component
const LoadingIndicator = ({
  message,
  icon,
}: {
  message: string;
  icon?: string;
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 backdrop-blur-sm">
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-spin">
          <div className="absolute inset-1 rounded-full bg-slate-900" />
        </div>
        <div className="absolute inset-0 w-6 h-6 rounded-full bg-amber-400/20 animate-ping" />
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-amber-300 font-medium">{message}</span>
        <span className="text-amber-400 font-mono w-4">{dots}</span>
      </div>

      {/* Progress bar */}
      <div className="flex-1 max-w-20 h-1 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"
          style={{ width: "60%" }}
        />
      </div>
    </div>
  );
};

// Enhanced Message Content
const MessageContent = ({
  content,
  role,
}: {
  content: string;
  role: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const isUser = role === "user";

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div
        className={`relative px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
          isUser
            ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white ml-auto max-w-[80%]"
            : "bg-gradient-to-r from-slate-800/90 to-slate-700/90 text-slate-100 border border-slate-600/30"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

        {/* Message tail */}
        <div
          className={`absolute top-4 w-3 h-3 rotate-45 ${
            isUser
              ? "-right-1 bg-gradient-to-br from-blue-600 to-indigo-600"
              : "-left-1 bg-gradient-to-br from-slate-800 to-slate-700 border-l border-t border-slate-600/30"
          }`}
        />
      </div>

      {/* Timestamp */}
      <div
        className={`mt-1 text-xs text-slate-500 ${
          isUser ? "text-right mr-4" : "ml-4"
        }`}
      >
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

export default function Message({ message }: { message: Message }) {
  const [isVisible, setIsVisible] = useState(false);
  const isUser = message.role === "user";
  const hasTools =
    message.toolInvocations && message.toolInvocations.length > 0;
  const isProcessing =
    hasTools &&
    message.toolInvocations?.some((tool) => tool.state !== "result");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div
        className={`flex gap-4 p-6 group hover:bg-slate-800/30 transition-all duration-300 ${
          !isUser
            ? "bg-gradient-to-r from-slate-900/50 to-slate-800/30 rounded-2xl border border-slate-700/30 backdrop-blur-sm"
            : ""
        }`}
      >
        {/* Avatar */}
        <Avatar role={message.role} isTyping={isProcessing} />

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Message text */}
          {message.content && (
            <MessageContent content={message.content} role={message.role} />
          )}

          {/* Tool invocations */}
          <div className="space-y-3">
            {message.toolInvocations?.map((tool) => {
              const { toolName, toolCallId, state } = tool;

              if (state === "result") {
                return (
                  <div key={toolCallId} className="animate-fadeIn">
                    {toolName === "cryptoToolPrice" && (
                      <Crypto {...tool.result} />
                    )}
                    {toolName === "Sendcrypto" && (
                      <Cryptosend {...tool.result} />
                    )}
                    {toolName === "Convertbtc" && (
                      <Depositbtc {...tool.result} />
                    )}
                    {toolName === "Sendstx" && <Sendstx {...tool.result} />}
                    {toolName === "getSbtcbalance" && (
                      <SbtcBalance {...tool.result} />
                    )}
                    {toolName === "cryptoHistoricalPrice" && (
                      <CryptoPriceHistory {...tool.result} />
                    )}
                  </div>
                );
              } else {
                // Loading states
                const loadingMessages = {
                  cryptoToolPrice: "Loading coin price",
                  Sendcrypto: "Processing transaction",
                  Convertbtc: "Processing conversion",
                  Sendstx: "Processing STX transaction",
                  getSbtcbalance: "Fetching balance",
                  cryptoHistoricalPrice: "Fetching price history",
                };

                return (
                  <LoadingIndicator
                    key={toolCallId}
                    message={
                      loadingMessages[
                        toolName as keyof typeof loadingMessages
                      ] || "Processing"
                    }
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo component
function DemoMessage() {
  const sampleMessage: Message = {
    id: "1",
    role: "assistant",
    content:
      "Here's the current Bitcoin price information you requested. The market is showing strong performance today!",
    toolInvocations: [
      {
        toolCallId: "demo-1",
        toolName: "cryptoToolPrice",
        state: "result",
        result: { price: 67500, symbol: "BTC" },
      },
    ],
  };

  const userMessage: Message = {
    id: "2",
    role: "user",
    content: "Can you show me the current Bitcoin price?",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <Message message={userMessage} />
        <Message message={sampleMessage} />
      </div>
    </div>
  );
}
