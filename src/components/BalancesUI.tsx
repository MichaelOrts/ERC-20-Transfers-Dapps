'use client'

import { useEffect, useState, FC } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import TableUI from './TableUI';
import { useAccount, useReadContracts } from 'wagmi';
import { publicClientHardhat, publicClientSepolia } from "../utils/client";
import { erc20Abi, formatEther } from 'viem';
import { toast } from 'sonner';

const BalancesUI: FC = () => {

    const [publicClient, setPublicClient] = useState<typeof publicClientSepolia>(publicClientSepolia);
    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>();
    const [data, setData] = useState<[string, `0x${string}`, string, string][]>([]);
    const [validTokenAddress, setValidTokenAddress] = useState<boolean>(false);
    const [inputFocused, setInputFocused] = useState<boolean>(false);
    const { address, chain, isConnected } = useAccount();

    const { data: tokensBalances, refetch, status, error } = useReadContracts({
        allowFailure: false,
        contracts: data.map(([,tokenAddress]) => ({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address]
        }))
    });

    useEffect(() => {
        setPublicClient(chain?.name === "Hardhat" ? publicClientHardhat : publicClientSepolia);
        //setData([]);
    }, [chain]);

    useEffect(() => {
        if (!tokensBalances) return;
        const newData: [string, `0x${string}`, string, string][] = data.map(([name, tokenAddress, , symbol], i) => {
            return [name, tokenAddress, formatEther(tokensBalances[i] as bigint) + " " + name, symbol];
        });
        setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokensBalances]);

    useEffect(() => {
        const storedData = window.localStorage.getItem("tokens");
        if (storedData) {
            setData(JSON.parse(storedData) as [string, `0x${string}`, string, string][]);
            refetch();
        }
    }, [refetch]);

    useEffect(() => {
        if (!address) return;
        refetch();
    }, [address, refetch]);

    useEffect(() => {
        window.localStorage.setItem("tokens", JSON.stringify(data));
    }, [data]);

    const addToken = async() => {
        if (!tokenAddress) {
            console.error("Token address is undefined");
            return;
        }
        // Check for duplicates
        if (data.some(([, address]) => address === tokenAddress)) {
            toast.error("Error adding token", {
                description: "Token address " + tokenAddress + " already exists.",
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
            return;
        }

        try {
            document.body.style.cursor = 'wait';
            const tokenName: string = await publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'name'
            }) as string;
            const tokenSymbol: string = await publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'symbol'
            }) as string;
            const tokenBalance: bigint = await publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [address as `0x${string}`]
            }) as bigint;
            const newData: [string, `0x${string}`, string, string][] = [...data, [tokenName, tokenAddress, formatEther(tokenBalance) + " " + tokenSymbol, tokenSymbol]];
            setData(newData);
        } catch {
            toast.error("Error adding token", {
                description: "Address " + tokenAddress + " is not a valid ERC-20 token address.",
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
        } finally {
            document.body.style.cursor = 'default';
        }
    }

    const removeToken = () => {
        if (data.find(([, address]) => address === tokenAddress) === undefined) {
            toast.error("Error removing token", {
                description: "Address " + tokenAddress + " is not found in current tokens list.",
                duration: 5000,
                style: {backgroundColor: "oklch(0.808 0.114 19.571)"}
            });
        }
        const newData: [string, `0x${string}`, string, string][] = data.filter(([, address]) => address !== tokenAddress);
        setData(newData);
    }

    const isAddressValid = (address: string): boolean => {
        toast(/^0x[a-fA-F0-9]{40}$/.test(address).toString());
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    return (
        <div className="border-3 rounded-xl p-4 space-y-4">
            <TableUI tableCaption="Tokens balances" headCaption={["Token", "Address", "Balance"]} cellDatas={data.map(([tokenName, tokenAddress, tokenBalance]) => [tokenName, tokenAddress, tokenBalance])} />
            {inputFocused && validTokenAddress === false &&
                <Alert className="border-red-500" variant={undefined}>
                <AlertTitle className="font-bold text-red-500">Token Address Error</AlertTitle>
                    <AlertDescription className="text-red-500">Token address must be a valid Ethereum address. (^0x[a-fA-F0-9]{40}$)</AlertDescription>
                </Alert>
            }
            <div className="flex flex-row justify-between space-x-2">
                <Label className="text-sm">Token Address</Label>
                <Input
                    placeholder="token address"
                    className={undefined}
                    type="text"
                    pattern="^0x[a-fA-F0-9]{40}$"
                    disabled={!isConnected}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValidTokenAddress(isAddressValid(e.target.value));
                        setTokenAddress(e.target.value as `0x${string}`);
                    }}
                />
                <Button className="bg-blue-700 text-white shadow hover:bg-blue-700/90 cursor-pointer" variant={undefined} size={undefined} disabled={!isConnected || !validTokenAddress} onClick={addToken}>Add Token</Button>
                <Button className="bg-blue-700 text-white shadow hover:bg-blue-700/90 cursor-pointer" variant={undefined} size={undefined} disabled={!isConnected || !validTokenAddress} onClick={removeToken}>Remove Token</Button>
            </div>
            <p>{status?.toString()}</p>
            <p>{error?.message}</p>
        </div>
    );
  }
  
  export default BalancesUI;