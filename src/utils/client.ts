import { createPublicClient, http, PublicClient, Transport } from "viem";
import { Chain, hardhat, sepolia } from "viem/chains";

const RPC: string = process.env.NEXT_PUBLIC_ALCHEMY_RPC || "";

export const publicClientHardhat: PublicClient<Transport, Chain> = createPublicClient({
    chain: hardhat,
    transport: http(),
});

export const publicClientSepolia: PublicClient<Transport, Chain> = createPublicClient({
    chain: sepolia,
    transport: http(RPC),
});