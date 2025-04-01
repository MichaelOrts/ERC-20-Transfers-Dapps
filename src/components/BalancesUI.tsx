'use client'

import { useState, FC } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import TableUI from './TableUI';
import { type ReadContractsErrorType } from '@wagmi/core';
import { isAddressValid } from '@/utils/utils';
import { formatUnits } from 'viem';

interface TableUIProps {
    isConnected: boolean;
    datas: Map<`0x${string}`, [string, string, number, bigint]>;//[string, `0x${string}`, string][];
    addToken: (tokenAddress: `0x${string}`) => void;
    removeToken: (tokenAddress: `0x${string}`) => void;
    status: string | undefined;
    error: ReadContractsErrorType | null;
}

const BalancesUI: FC<TableUIProps> = ({isConnected, datas, addToken, removeToken, status, error}) => {

    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>();
    const [validTokenAddress, setValidTokenAddress] = useState<boolean>(false);
    const [inputFocused, setInputFocused] = useState<boolean>(false);

    const tokensArray = Array.from(datas.entries()).map(([address, [name, symbol, decimals, balance]]) => {
        return [name, address, formatUnits(balance, decimals) + " " + symbol] as [string, `0x${string}`, string];
    });

    return (
        <div className="border-3 rounded-xl p-4 space-y-4">
            <TableUI tableCaption="Tokens balances" headCaption={["Token", "Address", "Balance"]} cellDatas={tokensArray} />
            {inputFocused && validTokenAddress === false &&
                <Alert className="border-red-500" variant={undefined}>
                <AlertTitle className="font-bold text-red-500">Token Address Error</AlertTitle>
                    <AlertDescription className="text-red-500">
                        Token address must be a valid Ethereum address. (^0x[a-fA-F0-9]{40}$)
                    </AlertDescription>
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
                <Button
                    className="bg-blue-700 text-white shadow hover:bg-blue-700/90 cursor-pointer"
                    variant={undefined}
                    size={undefined}
                    disabled={!isConnected || !validTokenAddress}
                    onClick={() => addToken(tokenAddress as `0x${string}`)}>
                    Add Token
                </Button>
                <Button
                    className="bg-blue-700 text-white shadow hover:bg-blue-700/90 cursor-pointer"
                    variant={undefined}
                    size={undefined}
                    disabled={!isConnected || !validTokenAddress}
                    onClick={() => removeToken(tokenAddress as `0x${string}`)}>
                    Remove Token
                </Button>
            </div>
            <p>{status?.toString()}</p>
            <p>{error?.message}</p>
        </div>
    );
  }
  
  export default BalancesUI;