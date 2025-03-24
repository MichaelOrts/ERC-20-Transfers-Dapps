'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAccount, useWriteContract } from 'wagmi';
import { publicClientHardhat, publicClientSepolia } from '@/utils/client';
import { erc20Abi, parseEther } from 'viem';

const SendTokensUI: React.FC = () => {

    const [publicClient, setPublicClient] = useState<typeof publicClientSepolia>(publicClientSepolia);
    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>();
    const [receiverAddress, setReceiverAddress] = useState<`0x${string}`>();
    const [amount, setAmount] = useState<string>('0');
    const { chain, isConnected } = useAccount();

    useEffect(() => {
        setPublicClient(chain?.name === "Hardhat" ? publicClientHardhat : publicClientSepolia);
    }, [publicClient, chain]);

    const { writeContract } = useWriteContract(); // TODO check errors

    const sendTokens = async() => {
            
        if (!tokenAddress) {
            console.error("Token address is undefined"); // TODO toast error
            return;
        } else if (!receiverAddress) {
            console.error("Receiver address is undefined"); // TODO toast error
        } else{
            writeContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'transfer',
                args: [receiverAddress, parseEther(amount)] // TODO check decimals
            });
        }
    }

    return (
        <div className="flex flex-col border-3 rounded-xl p-4 space-y-4">
            <Label className="self-center text-xl mt-4">Send Tokens</Label>
            <div>
                <Label className="text-sm">Token Address</Label>
                <Input placeholder="token address" className={undefined} type="text" disabled={!isConnected} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenAddress(e.target.value as `0x${string}`)}/>
            </div>
            <div>
                <Label className="text-sm">Receiver</Label>
                <Input placeholder="receiver" className={undefined} type="text" disabled={!isConnected} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReceiverAddress(e.target.value as `0x${string}`)}/>
            </div>
            <div>
                <Label className="text-sm">Amount</Label>
                <Input placeholder="amount" className={undefined} type="number" disabled={!isConnected} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)} />
            </div>
            <Button className="self-center bg-blue-700 text-white shadow hover:bg-blue-700/90" variant={undefined} size={undefined} disabled={!isConnected} onClick={sendTokens}>Send</Button>
        </div>
    );
  }
  
  export default SendTokensUI;