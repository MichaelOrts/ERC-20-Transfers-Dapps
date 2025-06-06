'use client'

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from 'react';

const config = getDefaultConfig({
    appName: 'ERC-20-Transfers-Dapps',
    projectId: '4b89f8ce0af198f46977dc74b4aaba58',
    chains: [hardhat, sepolia],
    ssr: true, 
});

const queryClient = new QueryClient();

interface CustomRainbowKitProviderProps {
    children: ReactNode;
}

const CustomRainbowKitProvider: React.FC<CustomRainbowKitProviderProps> = ({children}) => {
  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
                {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  );
}
export default CustomRainbowKitProvider;
