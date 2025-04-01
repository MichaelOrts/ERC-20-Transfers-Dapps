'use client'

import { FC, useState } from 'react';
import TableUI from './TableUI';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';

interface TableUIProps {
    datas: Map<`0x${string}`, [string, string, number, bigint]>;
}

const TransactionsUI: FC<TableUIProps> = ({ datas }) => {

    const [data, setData] = useState<[string, string, string, string][]>([]);
    const { address } = useAccount();

    useWatchContractEvent({
        abi: erc20Abi,
        eventName: 'Transfer',
        poll : true,
        fromBlock: BigInt(0),
        onLogs(logs) {
            const newData: [string, string, string, string][] = logs.map(log => {
                const tokenDatas = datas.get(log.address);
                const amount = tokenDatas ? formatUnits(log.args.value as bigint, tokenDatas[2] as number) + " " + tokenDatas[1] : log.args.value;
                if ( log.args.from === address ) {
                    return [log.address, "Send", log.args.to as `0x${string}`, amount];
                } else if ( log.args.to === address ) {
                    return [log.address, "Receive", log.args.from as `0x${string}`, amount];
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