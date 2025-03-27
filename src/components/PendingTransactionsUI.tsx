'use client'

import React, { useEffect, useState } from 'react';
import TableUI from './TableUI';
import { publicClientSepolia, publicClientHardhat } from '@/utils/client';
import { useAccount, useWatchPendingTransactions } from 'wagmi';
//import { waitForTransactionReceipt } from '@wagmi/core';

const PendingTransactionsUI: React.FC = () => {
    const [publicClient, setPublicClient] = useState<typeof publicClientSepolia>(publicClientSepolia);
    const [data, setData] = useState<[string, string, string, string][]>([]); // Added "Accelerated" column
    const { chain } = useAccount();

    useEffect(() => {
        setPublicClient(chain?.name === "Hardhat" ? publicClientHardhat : publicClientSepolia);
    }, [publicClient, chain]);

    useWatchPendingTransactions({
        async onTransactions(transactions) {
            const newData: [string, string, string, string][] = await Promise.all(transactions.map(async (hash) => {
                try {
                    const transactionReceipt = await publicClient.waitForTransactionReceipt({
                        hash,
                        /*onReplaced: (newHash) => {
                            // Handle replaced transaction if needed
                        }*/
                    });

                    const status = transactionReceipt.status ? "Success" : "Failed";

                    return [
                        hash,
                        status,
                        transactionReceipt.gasUsed.toString(),
                        transactionReceipt.logs.length.toString()
                    ];
                } catch (error) {
                    console.error(`Error fetching transaction ${hash}:`, error);
                    return [hash, "Error", "-", "-"];
                }
            }));
            setData((prevData) => [...prevData, ...newData]);
        }
    });

    /*useWaitForTransactionReceipt({
        hash: 
        onReplaced: (hash) => {
            hash.
        }
    });*/

    return (
        <div className="border-3 rounded-xl p-4">
            <TableUI tableCaption="Pending Transactions" headCaption={["Hash", "Status", "Gas Used", "Logs Count"]} cellDatas={data} />
        </div>
    );
};

export default PendingTransactionsUI;