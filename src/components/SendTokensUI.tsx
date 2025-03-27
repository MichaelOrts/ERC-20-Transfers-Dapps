'use client'

import { useEffect, useState, FC } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAccount, useWriteContract } from 'wagmi';
import { publicClientHardhat, publicClientSepolia } from '@/utils/client';
import { erc20Abi, parseEther } from 'viem';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

const SendTokensUI: FC = () => {

    const [publicClient, setPublicClient] = useState<typeof publicClientSepolia>(publicClientSepolia);
    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>();
    const [receiverAddress, setReceiverAddress] = useState<`0x${string}`>();
    const [amount, setAmount] = useState<string>('0');
    const [validTokenAddress, setValidTokenAddress] = useState<boolean>(false);
    const [validReceiverAddress, setValidReceiverAddress] = useState<boolean>(false);
    const [validAmount, setValidAmount] = useState<boolean>(false);
    const [inputTokenAddressFocused, setInputTokenAddressFocused] = useState<boolean>(false);
    const [inputReceiverAddressFocused, setInputReceiverAddressFocused] = useState<boolean>(false);
    const [inputAmountFocused, setInputAmountFocused] = useState<boolean>(false);
    const { chain, isConnected } = useAccount();

    useEffect(() => {
        setPublicClient(chain?.name === "Hardhat" ? publicClientHardhat : publicClientSepolia);
    }, [publicClient, chain]);

    const { writeContract, status, error } = useWriteContract();

    const sendTokens = async() => {
        if (!tokenAddress) {
            console.error("Token address is undefined");
            return;
        } else if (!receiverAddress) {
            console.error("Receiver address is undefined");
        } else{
            writeContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'transfer',
                args: [receiverAddress, parseEther(amount)]
            });
        }
    }

    const isAddressValid = (address: string): boolean => {
        toast(/^0x[a-fA-F0-9]{40}$/.test(address).toString());
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    const isAmountValid = (amount: number): boolean => {
        return amount > 0;
    }

    return (
        <div className="flex flex-col border-3 rounded-xl p-4 space-y-4">
            <Label className="self-center text-xl mt-4">Send Tokens</Label>
            <div>
                {inputTokenAddressFocused && validTokenAddress === false &&
                    <Alert className="border-red-500" variant={undefined}>
                        <AlertTitle className="font-bold text-red-500">Token Address Error</AlertTitle>
                        <AlertDescription className="text-red-500">Token address must be a valid Ethereum address. (^0x[a-fA-F0-9]{40}$)</AlertDescription>
                    </Alert>
                }
                <Label className="text-sm">Token Address</Label>
                <Input placeholder="token address" className={undefined} type="text" disabled={!isConnected} onFocus={() => setInputTokenAddressFocused(true)}
                    onBlur={() => setInputTokenAddressFocused(false)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setValidTokenAddress(isAddressValid(e.target.value)); setTokenAddress(e.target.value as `0x${string}`)}}/>
            </div>
            <div>
                {inputReceiverAddressFocused && validReceiverAddress === false &&
                    <Alert className="border-red-500" variant={undefined}>
                        <AlertTitle className="font-bold text-red-500">Receiver Address Error</AlertTitle>
                        <AlertDescription className="text-red-500">Receiver address must be a valid Ethereum address. (^0x[a-fA-F0-9]{40}$)</AlertDescription>
                    </Alert>
                }
                <Label className="text-sm">Receiver</Label>
                <Input placeholder="receiver" className={undefined} type="text" disabled={!isConnected} onFocus={() => setInputReceiverAddressFocused(true)} onBlur={() => setInputReceiverAddressFocused(false)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setValidReceiverAddress(isAddressValid(e.target.value)); setReceiverAddress(e.target.value as `0x${string}`)}}/>
            </div>
            <div>
                {inputAmountFocused && validAmount === false &&
                    <Alert className="border-red-500" variant={undefined}>
                        <AlertTitle className="font-bold text-red-500">Amount Error</AlertTitle>
                        <AlertDescription className="text-red-500">Amount must be &gt; 0.</AlertDescription>
                    </Alert>
                }
                <Label className="text-sm">Amount</Label>
                <Input placeholder="amount" className={undefined} type="number" disabled={!isConnected} onFocus={() => setInputAmountFocused(true)} onBlur={() => setInputAmountFocused(false)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setValidAmount(isAmountValid(Number(e.target.value))); setAmount(e.target.value)}} />
            </div>
            <Button className="self-center bg-blue-700 text-white shadow hover:bg-blue-700/90 cursor-pointer" variant={undefined} size={undefined} disabled={!isConnected || !validTokenAddress || !validReceiverAddress || !validAmount} onClick={sendTokens}>Send</Button>
            <p>{status?.toString()}</p>
            <p>{error?.message}</p>
        </div>
    );
  }
  
  export default SendTokensUI;