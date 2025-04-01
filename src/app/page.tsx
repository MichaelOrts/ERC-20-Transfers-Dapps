'use client'

import { JSX, useEffect, useState } from "react";
import BalancesUI from "../components/BalancesUI";
import TransactionsUI from "../components/TransactionsUI";
import SendTokensUI from "../components/SendTokensUI";
import PendingTransactionsUI from "../components/PendingTransactionsUI";
import { publicClientSepolia, publicClientHardhat } from "@/utils/client";
import { useAccount, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { erc20Abi, parseUnits } from "viem";
import { toast } from "sonner";

export default function Home(): JSX.Element {

    const [publicClient, setPublicClient] = useState<typeof publicClientSepolia>(publicClientSepolia);
    const [tokensAddress, setTokensAddress] = useState<`0x${string}`[]>([]);
    const [tokensDatas, setTokensDatas] = useState<Map<`0x${string}`, [string, string, number, bigint]>>(new Map<`0x${string}`, [string, string, number, bigint]>());
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
            },
            {
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'decimals'
            }
        ]).flat()
    });

    const { data: writeTransactionHash, writeContract, status: sendTokensStatus, error: sendTokensError } = useWriteContract();

    const { isSuccess: pendingTransactionSuccess, error: pendingTransactionError } = useWaitForTransactionReceipt({
        hash: writeTransactionHash,
        onReplaced: replacement => toast.info("Transaction replaced", {
            description: "Transaction " + replacement.reason + " with hash: " + replacement.replacedTransaction.hash,
            duration: 5000,
            style: {backgroundColor: "oklch(0.809 0.105 251.813)"}
        }),
    });

    useEffect(() => {
        if (sendTokensError) {
            toast.error("Error send tokens write", {
                description: sendTokensError.message,
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
        }
    }, [sendTokensError]);

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
        if (pendingTransactionError) {
            toast.error("Error send tokens wait", {
                description: pendingTransactionError.message,
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
        }
    }, [pendingTransactionError]);

    useEffect(() => {
        setPublicClient(chain?.name === "Hardhat" ? publicClientHardhat : publicClientSepolia);
    }, [publicClient, chain]);

    useEffect(() => {
        if (!address) return;
        refetchBalances();
    }, [address, pendingTransactionSuccess, refetchBalances]);

    useEffect(() => {
        if (!tokensAddress || !tokensConstants || !tokensBalances) return;
        const newDatas: Map<`0x${string}`, [string, string, number, bigint]> = tokensAddress.map((tokenAddress, i) => {
            return [tokenAddress, [tokensConstants[i * 3] as string, tokensConstants[i * 3 + 1] as string, tokensConstants[i * 3 + 2] as number, tokensBalances[i] as bigint]];
        }).reduce((map, [tokenAddress, data]) => {
            map.set(tokenAddress as `0x${string}`, data as [string, string, number, bigint]);
            return map;
        }, new Map<`0x${string}`, [string, string, number, bigint]>());
        setTokensDatas(newDatas);
    }, [tokensAddress, tokensConstants, tokensBalances]);

    useEffect(() => {
        const storedData = window.localStorage.getItem("tokens");
        if (storedData) {
            setTokensAddress(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("tokens", JSON.stringify(tokensAddress));
        refetchTokensConstants();
        refetchBalances();
    }, [tokensAddress, refetchTokensConstants, refetchBalances]);

    const addToken = (tokenAddress: `0x${string}`) => {
        const lowerCaseTokenAddress: `0x${string}` = tokenAddress.toLowerCase() as `0x${string}`;
        if (tokensAddress.includes(lowerCaseTokenAddress)) {
            toast.error("Error adding token", {
                description: "Token address " + tokenAddress + " already exists.",
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
            return;
        }
        setTokensAddress((prevTokens) => [...prevTokens, lowerCaseTokenAddress]);
    }

    const removeToken = (tokenAddress: `0x${string}`) => {
        const lowerCaseTokenAddress: `0x${string}` = tokenAddress.toLowerCase() as `0x${string}`;
        if (tokensAddress.find((address) => address === lowerCaseTokenAddress) === undefined) {
            toast.error("Error removing token", {
                description: "Address " + tokenAddress + " is not found in current tokens list.",
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
        }
        setTokensAddress((prevTokens) => prevTokens.filter((address) => address !== lowerCaseTokenAddress));
    }

    const sendTokens = (tokenAddress: `0x${string}`, receiverAddress: `0x${string}`, amount: string) => {
        writeContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'transfer',
            args: [receiverAddress, parseUnits(amount, tokensDatas.get(tokenAddress)?.[2] as number)]
        });
    }
    
    return (
        <div className="grid grid-flow-row grid-cols-2 gap-8 text-4xl text-bold">
            <BalancesUI isConnected={isConnected} datas={tokensDatas} addToken={addToken} removeToken={removeToken} status={refetchBalancesStatus} error={refetchBalancesError} />
            <TransactionsUI datas={tokensDatas} />
            <SendTokensUI isConnected={isConnected} sendTokens={sendTokens} status={sendTokensStatus} error={sendTokensError} />
            <PendingTransactionsUI />
        </div>
    );
}
