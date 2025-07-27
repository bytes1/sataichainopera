"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
} from "@stacks/connect";

export const AuthContext = createContext<{
  isConnected: boolean;
  walletAddress: string;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => void;
}>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      if (isConnected()) {
        setConnected(true);
        const data = getLocalStorage();
        if (data?.addresses?.stx?.length) {
          setWalletAddress(data.addresses.stx[0].address);
        }
      }
    };
    checkConnection();
  }, []);

  const handleConnect = async () => {
    await connect();
    if (isConnected()) {
      setConnected(true);
      const data = getLocalStorage();
      if (data?.addresses?.stx?.length) {
        setWalletAddress(data.addresses.stx[0].address);
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setConnected(false);
    setWalletAddress("");
  };

  return (
    <AuthContext.Provider
      value={{
        isConnected: connected,
        walletAddress,
        handleConnect,
        handleDisconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
