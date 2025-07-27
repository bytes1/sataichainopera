import { tool } from "ai";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";
import {
  fetchCallReadOnlyFunction,
  cvToString,
  ClarityType,
} from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";

export const cryptoToolPrice = tool({
  description:
    "Get price for a crypto currency. only execute when price is asked",
  parameters: z.object({
    symbol: z
      .string()
      .describe("The crypto symbol to get the price for (e.g., BTC, ETH)"),
  }),
  execute: async function ({ symbol }) {
    const API_KEY = process.env.COINMARKETCAP_API_KEY; // Replace with your CoinMarketCap API key

    if (!API_KEY) {
      throw new Error("CoinMarketCap API key is not configured");
    }
    const convert = "USD"; // Convert price to USD

    const url =
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";

    try {
      // Make the API request using Axios
      const response = await axios.get(url, {
        headers: {
          "X-CMC_PRO_API_KEY": API_KEY,
          Accept: "application/json",
        },
        params: {
          symbol: symbol.toUpperCase(), // Ensure the symbol is in uppercase
          convert: convert,
        },
      });

      // Extract the price from the response
      const price =
        response.data.data[symbol.toUpperCase()].quote[convert].price;

      // Return the symbol and price
      return { symbol, price };
    } catch (error) {
      // Handle errors
      throw new Error("Failed to fetch crypto price");
    }
  },
});

export const Sendcrypto = tool({
  description:
    "function to send crypto when address(crypto address) and amount is given. then only execute this when send sbtc",
  parameters: z.object({
    address: z
      .string()
      .describe("the blockchain address of person. token need to send"),
    amount: z.string().describe("Amount of tokens need to send"),
  }),
  execute: async function ({ address, amount }) {
    // Simulated API call

    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { address, amount };
  },
});

export const Sendstx = tool({
  description:
    "function to send crypto when address(crypto address) and amount is given. then only execute this when send stx",
  parameters: z.object({
    address: z
      .string()
      .describe("the blockchain address of person. token need to send"),
    amount: z.string().describe("Amount of tokens need to send"),
  }),
  execute: async function ({ address, amount }) {
    // Simulated API call

    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { address, amount };
  },
});

export const Convertbtc = tool({
  description: "function to convert btc to sbtc. when amount is given.",
  parameters: z.object({
    amount: z.string().describe("Amount of tokens need to deposit"),
  }),
  execute: async function ({ amount }) {
    // Simulated API call

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return { amount };
  },
});

export const getSbtcbalance = tool({
  description: "function to get token balance. when address is given.",
  parameters: z.object({
    address: z
      .string()
      .describe("address of wallet token balance need to fetch"),
  }),
  execute: async function ({ address }) {
    let header = undefined;
    if (process.env.HIRO_API_KEY) {
      header = {
        headers: {
          "X-API-Key": process.env.HIRO_API_KEY,
        },
      };
    }
    console.log("balance funtion");
    const targetPath = `  https://api.testnet.hiro.so/extended/v1/address/${address}/balances`;

    try {
      const { data } = await axios.get(targetPath, header);
      console.log("data", data);
      const fungibleTokens = data.fungible_tokens;
      let balances = [];

      // Return the balance for the account
      for (const tokenName in fungibleTokens) {
        const token = fungibleTokens[tokenName];
        const tokenComponents = tokenName.split("::");
        const contract = tokenComponents[0].split(".");
        const contractId = contract[0];
        const contractName = contract[1];

        try {
          // Fetch token decimals
          const decimalResult = await fetchCallReadOnlyFunction({
            contractName: contractName,
            contractAddress: contractId,
            functionName: "get-decimals",
            functionArgs: [],
            senderAddress: address,
            network: STACKS_TESTNET,
          });

          // Fetch token symbol
          const symbolResult = await fetchCallReadOnlyFunction({
            contractName: contractName,
            contractAddress: contractId,
            functionName: "get-symbol",
            functionArgs: [],
            senderAddress: address,
            network: STACKS_TESTNET,
          });

          // Extract values from the ClarityValue results
          let decimals = 6; // Default fallback
          let symbol = tokenName; // Default fallback

          // Parse decimals (usually returns a UIntCV)
          if (decimalResult && decimalResult.type === ClarityType.UInt) {
            decimals = parseInt(decimalResult.value.toString());
          }

          // Parse symbol (usually returns a StringAsciiCV or StringUtf8CV)
          if (symbolResult) {
            if (symbolResult.type === ClarityType.StringASCII) {
              symbol = (symbolResult as any).value;
            } else if (symbolResult.type === ClarityType.StringUTF8) {
              symbol = (symbolResult as any).value;
            } else {
              // Fallback: convert any ClarityValue to string
              symbol = cvToString(symbolResult).replace(/"/g, "");
            }
          }

          // Calculate human-readable balance
          const rawBalance = token.balance;
          const humanReadableBalance = (
            parseInt(rawBalance) / Math.pow(10, decimals)
          ).toFixed(decimals);

          balances.push({
            token: symbol,
            balance: humanReadableBalance,
            rawBalance: rawBalance,
            contractId: tokenName,
          });
        } catch (readOnlyError) {
          console.warn(
            `Failed to fetch token details for ${tokenName}:`,
            readOnlyError
          );
          // Fallback: use raw balance without proper formatting
          balances.push({
            token: tokenName,
            balance: token.balance,
            rawBalance: token.balance,
            contractId: tokenName,
          });
        }
      }

      // Format the response
      if (balances.length === 0) {
        return "No fungible tokens found for this address.";
      }

      return balances;
    } catch (error) {
      console.error("Error fetching token balances:", error);
      throw new Error(`Failed to fetch token balances: ${error}`);
    }
  },
});

interface Quote {
  timestamp: string;
  quote: {
    USD: {
      price: number;
    };
  };
}

interface CoinMarketCapResponse {
  data: {
    quotes: Quote[];
  };
}

interface HistoricalPriceResult {
  symbol: string;
  prices: Array<{ date: string; price: number }>;
}

/**
 * Fetches historical price data for a cryptocurrency in USD for a user-specified number of days.
 * @param {Object} params - Parameters for the historical price query
 * @param {string} params.symbol - The cryptocurrency symbol (e.g., BTC, ETH)
 * @param {number} params.days - Number of days to fetch historical data for (e.g., 7, 30)
 * @returns {Promise<HistoricalPriceResult>} The symbol and its daily prices
 */
export const cryptoHistoricalPrice = tool({
  description:
    "Fetch historical price data for a cryptocurrency for a specified number of days.",
  parameters: z.object({
    symbol: z
      .string()
      .describe("The crypto symbol to get the price for (e.g., BTC, ETH)")
      .refine((val) => ["BTC", "ETH", "USDT"].includes(val.toUpperCase()), {
        message: "Invalid cryptocurrency symbol",
      }),
    days: z
      .number()
      .int()
      .positive()
      .describe("Number of days to fetch historical data for (e.g., 7, 30)"),
  }),
  execute: async function ({ symbol, days }): Promise<HistoricalPriceResult> {
    const API_KEY = process.env.COINMARKETCAP_API_KEY;
    if (!API_KEY) {
      throw new Error("CoinMarketCap API key is not configured");
    }

    // Calculate start and end dates
    const endDate = new Date(); // Today: 2025-07-18
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days); // Subtract user-specified days

    // Format dates as YYYY-MM-DD
    const time_end = endDate.toISOString().split("T")[0];
    const time_start = startDate.toISOString().split("T")[0];

    try {
      const response: AxiosResponse<CoinMarketCapResponse> = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical",
        {
          headers: {
            "X-CMC_PRO_API_KEY": API_KEY,
            Accept: "application/json",
          },
          params: {
            symbol: symbol.toUpperCase(),
            time_start,
            time_end,
            convert: "USD",
            interval: "daily",
          },
        }
      );

      const prices = response.data.data.quotes.map((quote: Quote) => ({
        date: quote.timestamp.split("T")[0], // Extract YYYY-MM-DD
        price: quote.quote.USD.price,
      }));

      if (!prices.length) {
        throw new Error(
          `No price data available for ${symbol} for the last ${days} days`
        );
      }

      return { symbol, prices };
    } catch (error: unknown) {
      // Narrow the error type
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(
        `Error fetching historical prices for ${symbol} over ${days} days:`,
        errorMessage
      );
      throw new Error(`Failed to fetch historical prices: ${errorMessage}`);
    }
  },
});

export const tools = {
  cryptoToolPrice,
  Sendcrypto,
  Convertbtc,
  Sendstx,
  getSbtcbalance,
  cryptoHistoricalPrice,
};
