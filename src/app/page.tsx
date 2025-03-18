'use client'

import Main from "@/components/Main";
import NotConnected from "@/components/NotConnected";

import { useAccount } from "wagmi";
import { JSX } from "react";

export default function Home(): JSX.Element {
  
    const { isConnected } = useAccount();
    
    return (
        <>
            { isConnected ? (
                <Main />
            ) : (
                <NotConnected />
            )}
        </>
    );
}
