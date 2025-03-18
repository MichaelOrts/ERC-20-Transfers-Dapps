'use client'

import { JSX } from "react";
import BalancesUI from "../components/BalancesUI";
import TransactionsUI from "../components/TransactionsUI";
import SendTokensUI from "../components/SendTokensUI";
import PendingTransactionsUI from "../components/PendingTransactionsUI";

export default function Home(): JSX.Element {
    
    return (
        <div className="grid grid-flow-row grid-cols-2 gap-8 text-4xl text-bold">
            <BalancesUI />
            <TransactionsUI />
            <SendTokensUI />
            <PendingTransactionsUI />
        </div>
    );
}
