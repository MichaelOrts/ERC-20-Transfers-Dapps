'use client'

import React from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SendTokensUI: React.FC = () => {

    return (
        <div className="flex flex-col border-3 rounded-xl p-4 space-y-4">
            <Label className="self-center text-xl mt-4">Send Tokens</Label>
            <div>
                <Label className="text-sm">Token Address</Label>
                <Input placeholder="token address" className={undefined} type={undefined} />
            </div>
            <div>
                <Label className="text-sm">Receiver</Label>
                <Input placeholder="receiver" className={undefined} type={undefined} />
            </div>
            <div>
                <Label className="text-sm">Amount</Label>
                <Input placeholder="amount" className={undefined} type={undefined} />
            </div>
            <Button className="self-center bg-blue-700 text-white shadow hover:bg-blue-700/90" variant={undefined} size={undefined}>Send</Button>
        </div>
    );
  }
  
  export default SendTokensUI;