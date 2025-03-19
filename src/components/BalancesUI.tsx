'use client'

import { useEffect, useState, FC } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from './ui/label';
import TableUI from './TableUI';
import { useAccount } from 'wagmi';
import { publicClientHardhat, publicClientSepolia } from "../utils/client";
import { formatEther } from 'viem';
import { IERC20_ABI } from '../constant/abi';

const BalancesUI: FC = () => {

    const [publicClient, setPublicClient] = useState<typeof publicClientSepolia>(publicClientSepolia);
    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>();
    const [data, setData] = useState<[string, string, string][]>([]);
    const { address, chain, isConnected } = useAccount();

    useEffect(() => {
        const storedData = window.localStorage.getItem("tokens");
        if (storedData) {
            setData(JSON.parse(storedData) as [string, string, string][]);
        }
    }, []);

    useEffect(() => {
        setPublicClient(chain?.name === "Hardhat" ? publicClientHardhat : publicClientSepolia);
    }, [publicClient, chain]);

    useEffect(() => {
        window.localStorage.setItem("tokens", JSON.stringify(data));
    }, [data]);

    const addToken = async() => {
        
        if (!tokenAddress) {
            console.error("Token address is undefined"); // TODO toast error
            return;
        }

        // Check for duplicates
        if (data.some(([, address]) => address === tokenAddress)) {
            console.error("Token already exists"); // TODO toast error
            return;
        }

        try {
            document.body.style.cursor = 'wait';
            const tokenName: string = await publicClient.readContract({
                address: tokenAddress,
                abi: IERC20_ABI,
                functionName: 'name'
            }) as string;
            const tokenSymbol: string = await publicClient.readContract({
                address: tokenAddress,
                abi: IERC20_ABI,
                functionName: 'symbol'
            }) as string;
            const tokenBalance: bigint = await publicClient.readContract({
                address: tokenAddress,
                abi: IERC20_ABI,
                functionName: 'balanceOf',
                args: [address]
            }) as bigint;
            const newData: [string, string, string][] = [...data, [tokenName, tokenAddress, formatEther(tokenBalance) + " " + tokenSymbol]];
            setData(newData);
        } catch(e) {
            console.error(e);
        } finally {
            document.body.style.cursor = 'default';
        }
    }
    // TODO check address pattern and show message if not valid and disable button
    return (
        <div className="border-3 rounded-xl p-4 space-y-4">
            <TableUI tableCaption="Tokens balances" headCaption={["Token", "Address", "Balance"]} cellDatas={data} />
            <div className="flex flex-row justify-between space-x-2">
                <Label className="text-sm">Token Address</Label>
                <Input placeholder="token address" className={undefined} type="text" pattern="^0x[a-fA-F0-9]{40}$" disabled={!isConnected} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenAddress(e.target.value as `0x${string}`)}/>
                <Button className="bg-blue-700 text-white shadow hover:bg-blue-700/90 cursor-pointer" variant={undefined} size={undefined} disabled={!isConnected} onClick={addToken}>Add Token</Button>
            </div>
        </div>
    );
  }
  
  export default BalancesUI;