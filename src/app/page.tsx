'use client'

import { JSX, useEffect, useState } from "react";
import BalancesUI from "../components/BalancesUI";
import TransactionsUI from "../components/TransactionsUI";
import SendTokensUI from "../components/SendTokensUI";
import PendingTransactionsUI from "../components/PendingTransactionsUI";
import { publicClientSepolia, publicClientHardhat } from "@/utils/client";
import { useAccount, useReadContracts } from "wagmi";
import { erc20Abi, formatEther } from "viem";
import { toast } from "sonner";

export default function Home(): JSX.Element {

    const [publicClient, setPublicClient] = useState<typeof publicClientSepolia>(publicClientSepolia);
    const [tokensAddress, setTokensAddress] = useState<`0x${string}`[]>([]);
    const [tokensDatas, setTokensDatas] = useState<[string, `0x${string}`, string][]>([]);
    const { address, chain, isConnected } = useAccount();

    const { data: tokensBalances, refetch: refetchBalances, status: refetchBalancesStatus, error: refetchBalancesError } = useReadContracts({
        allowFailure: false,
        contracts: tokensAddress.map((tokenAddress) => ({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [address]
            }))
    });

    const { data: tokensConstants, refetch: refetchTokensConstants, error: refetchTokensConstantsError } = useReadContracts({
        allowFailure: false,
        contracts: tokensAddress.map((tokenAddress) => [
            {
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'name'
            },
            {
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'symbol'
            }
        ]).flat()
    });

    useEffect(() => {
        if (refetchTokensConstantsError) {
            toast.error("Error adding token", {
                description: refetchTokensConstantsError.message,
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
        }
    }, [refetchTokensConstantsError]);

    useEffect(() => {
        setPublicClient(chain?.name === "Hardhat" ? publicClientHardhat : publicClientSepolia);
        setTokensAddress([]);
    }, [publicClient, chain]);

    useEffect(() => {
        if (!address) return;
        refetchBalances();
    }, [address, refetchBalances]);

    useEffect(() => {
        if (!tokensAddress || !tokensConstants || !tokensBalances) return;
        const newData: [string, `0x${string}`, string][] = tokensAddress.map((tokenAddress, i) => {
            return [tokensConstants[i * 2] as string, tokenAddress, formatEther(tokensBalances[i] as bigint) + " " + tokensConstants[i * 2 + 1]];
        });
        setTokensDatas(newData);
    }, [tokensAddress, tokensConstants, tokensBalances]);

    useEffect(() => {
        const storedData = window.localStorage.getItem("tokens");
        if (storedData) {
            setTokensAddress(JSON.parse(storedData));
            refetchTokensConstants();
            refetchBalances();
        }
    }, [refetchTokensConstants, refetchBalances]);

    useEffect(() => {
        window.localStorage.setItem("tokens", JSON.stringify(tokensAddress));
        refetchTokensConstants();
        refetchBalances();
    }, [tokensAddress, refetchTokensConstants, refetchBalances]);

    const addToken = (tokenAddress: `0x${string}`) => {
        if (tokensAddress.includes(tokenAddress)) {
            toast.error("Error adding token", {
                description: "Token address " + tokenAddress + " already exists.",
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
            return;
        }
        setTokensAddress((prevTokens) => [...prevTokens, tokenAddress]);
    }

    const removeToken = (tokenAddress: `0x${string}`) => {
        if (tokensAddress.find((address) => address === tokenAddress) === undefined) {
            toast.error("Error removing token", {
                description: "Address " + tokenAddress + " is not found in current tokens list.",
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
        }
        setTokensAddress((prevTokens) => prevTokens.filter((address) => address !== tokenAddress));
    }
    
    return (
        <div className="grid grid-flow-row grid-cols-2 gap-8 text-4xl text-bold">
            <BalancesUI isConnected={isConnected} datas={tokensDatas} addToken={addToken} removeToken={removeToken} status={refetchBalancesStatus} error={refetchBalancesError} />
            <TransactionsUI />
            <SendTokensUI />
            <PendingTransactionsUI />
        </div>
    );
}
