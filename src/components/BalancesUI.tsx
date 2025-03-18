'use client'

import React from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from './ui/label';
import TableUI from './TableUI';
  

const BalancesUI: React.FC = () => {

    return (
        <div className="border-3 rounded-xl p-4 space-y-4">
            <TableUI tableCaption="Tokens balances" headCaption={["Token", "Symbol", "Balance"]} cellDatas={[
                ["Token", "TKN", "250"],
                ["Other", "OTH", "150.525"],
                ["Last", "LS", "1000000"]
            ]} />
            <div className="flex flex-row justify-between space-x-2">
                <Label className="text-sm">Token Address</Label>
                <Input placeholder="token address" className={undefined} type={undefined} />
                <Button className="bg-blue-700 text-white shadow hover:bg-blue-700/90" variant={undefined} size={undefined}>Add Token</Button>
            </div>
        </div>
    );
  }
  
  export default BalancesUI;