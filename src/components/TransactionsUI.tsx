'use client'

import React, { useEffect, useState } from 'react';
import TableUI from './TableUI';
import { publicClientSepolia, publicClientHardhat } from '@/utils/client';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { erc20Abi, formatEther } from 'viem';

const TransactionsUI: React.FC = () => {

    const [publicClient, setPublicClient] = useState<typeof publicClientSepolia>(publicClientSepolia);
    const [data, setData] = useState<[string, string, string, string][]>([]);
    const { address, chain } = useAccount();

    useEffect(() => {
            setPublicClient(chain?.name === "Hardhat" ? publicClientHardhat : publicClientSepolia);
        }, [publicClient, chain]);

    useWatchContractEvent({
        abi: erc20Abi,
        eventName: 'Transfer',
        poll : true,
        fromBlock: BigInt(0),
        onLogs(logs) {
            const newData: [string, string, string, string][] = logs.map(log => {
                if ( log.args.from === address ) {
                    return [log.address, "Send", log.args.to as `0x${string}`, formatEther(log.args.value as bigint)];
                } else if ( log.args.to === address ) {
                    return [log.address, "Receive", log.args.from as `0x${string}`, formatEther(log.args.value as bigint)];
                }
            }).filter((data): data is [string, string, string, string] => data !== undefined);
            setData(newData);
        }
    });

    return (
        <div className="border-3 rounded-xl p-4">
            <TableUI tableCaption="Transactions Done" headCaption={["Token", "Direction", "Address", "Amount"]} cellDatas={data} />
        </div>
    );
  }
  
  export default TransactionsUI;