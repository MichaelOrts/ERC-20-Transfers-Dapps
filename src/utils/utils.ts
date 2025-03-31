export const isAddressValid = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export const isAmountValid = (amount: number): boolean => {
    return amount > 0;
}