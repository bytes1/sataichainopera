"use client";

import { useEffect, useRef } from "react";
import Message from "@/components/message";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@/contexts/auth-context";

// Helper for Icons (using inline SVG)
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {path}
  </svg>
);

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { isConnected, walletAddress, handleConnect, handleDisconnect } =
    useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Placeholder Data ---
  const chatHistory = [
    { id: 1, title: "Explaining ERC-721 Tokens" },
    { id: 2, title: "History of Bitcoin Halving" },
    { id: 3, title: "Smart Contract Ideas" },
  ];

  return (
    // Main screen container
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* ============================================= */}
      {/* LEFT SIDEBAR (Chat History)                     */}
      {/* ============================================= */}
      <aside className="w-64 flex-shrink-0 bg-gray-800/30 p-4 flex flex-col gap-4">
        <button className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          <Icon
            path={
              <>
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </>
            }
            className="w-4 h-4"
          />
          New Chat
        </button>
        <div className="flex-1 overflow-y-auto space-y-2 [scrollbar-width:thin] [scrollbar-color:#4a5568_#2d3748]">
          <h2 className="text-sm font-semibold text-gray-500 tracking-wider mb-2">
            History
          </h2>
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              className="w-full text-left text-sm p-2 rounded-md text-gray-300 hover:bg-white/5 truncate"
            >
              {chat.title}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-600 text-center">
          Your chats are saved locally.
        </div>
      </aside>

      {/* ============================================= */}
      {/* MAIN CHAT WINDOW (Your existing code)         */}
      {/* ============================================= */}
      <main className="flex-1 flex flex-col h-full bg-gray-800/50 shadow-2xl border-x border-gray-700/50">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-200">SAT AI</h1>
          {!isConnected ? (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Icon
                path={
                  <>
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                  </>
                }
                className="w-4 h-4"
              />
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg">
                <span className="text-sm font-mono text-gray-300">
                  {`${walletAddress.substring(
                    0,
                    6
                  )}...${walletAddress.substring(walletAddress.length - 4)}`}
                </span>
              </div>
              <button
                onClick={handleDisconnect}
                className="p-2 text-gray-400 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"
                title="Disconnect Wallet"
              >
                <Icon
                  path={
                    <>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </>
                  }
                />
              </button>
            </div>
          )}
        </header>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 [scrollbar-width:thin] [scrollbar-color:#4a5568_#2d3748]"
        >
          {messages.length > 0 ? (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          ) : (
            <div className="flex justify-center items-center h-full text-center">
              <p className="text-gray-500">
                The conversation is empty.
                <br />
                Ask a question to get started.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              className="flex-1 p-3 bg-gray-700/60 border border-transparent rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-110"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <Icon
                path={
                  <>
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </>
                }
                className="text-white w-5 h-5"
              />
            </button>
          </form>
        </div>
      </main>

      {/* ============================================= */}
      {/* RIGHT SIDEBAR (Settings & Info)               */}
      {/* ============================================= */}
      <aside className="w-64 flex-shrink-0 bg-gray-800/30 p-4 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-500 tracking-wider">
          SETTINGS
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              AI Model
            </label>
            <select
              id="model"
              className="w-full p-2 bg-gray-700/60 border border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option>Default Model (Fast)</option>
              <option>Advanced Model (Smart)</option>
            </select>
          </div>
          <button className="w-full p-2 text-sm bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/40 transition-colors">
            Clear Conversation
          </button>
        </div>
        <div className="flex-1"></div> {/* Spacer */}
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <h3 className="font-semibold text-gray-300">Learn More</h3>
          <p className="text-xs text-gray-400 mt-1">
            Check out the project documentation and resources.
          </p>
          <a
            href="#"
            className="text-sm text-indigo-400 hover:underline mt-2 inline-block"
          >
            View Docs
          </a>
        </div>
      </aside>
    </div>
  );
}
