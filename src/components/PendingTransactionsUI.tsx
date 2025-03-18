'use client'

import React from 'react';
import TableUI from './TableUI';

const PendingTransactionsUI: React.FC = () => {

    return (
        <div className="border-3 rounded-xl p-4">
            <TableUI tableCaption="Pending Transactions" headCaption={["Token", "Direction", "Address", "Amount"]} cellDatas={[
                ["TKN", "Send", "0x012345678901234567890123", "10"],
                ["TKN", "Receive", "0x987654321098765432109876", "25"],
                ["OTH", "Receive", "0x012345678901234567890123", "8.05"],
                ["LS", "Send", "0x987654321098765432109876", "120000"]
            ]} />
        </div>
    );
  }
  
  export default PendingTransactionsUI;