import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Image src="/logo.png" alt="Insert Logo Here" width={40} height={40} />
                    <h1 className="text-2xl font-bold">
                        <Link href="/">ERC-20-Transfers-Dapps</Link>
                    </h1>
                </div>
                <div>
                    <ConnectButton />
                </div>
            </div>
        </header>
    );
}

export default Header;
