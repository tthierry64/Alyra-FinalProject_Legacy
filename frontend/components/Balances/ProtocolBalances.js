'use client'
// import Contract from '../../../backend/artifacts/contracts/Bank.sol'
import { Flex, Alert, AlertIcon, Heading, Input, Button, Text, useToast, Spinner } from '@chakra-ui/react'

// Wagmi
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { useAccount, usePublicClient } from 'wagmi'

// Contracts informations
import { abiDAO, abiVault, abiWETH, contractInvestorAddress, contractVaultAddress, contractWETHAddress } from '@/constants';;

// ReactJS
import { useState, useEffect } from 'react'

// Viem
import { formatEther, parseEther, createPublicClient, http, parseAbiItem } from 'viem'
import { hardhat } from 'viem/chains'

const ProtocolBalances = () => {

    // Client Viem
    const client = usePublicClient();

    // Balance of the user State
    const [balanceWETHV, setBalanceWETHV] = useState(0);
    const [balanceWETHI, setBalanceWETHI] = useState(0);

    // IsLoading 
    const [isLoading, setIsLoading] = useState(false);

    // Toast
    const toast = useToast();

    // Account's informations
    const { address, isConnected } = useAccount();

    // Get the different balances of the user
    const getBalanceOfVaultWETH = async() => {
        try {
            const data = await readContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'balanceOf',
                args: [contractVaultAddress],
            })
            return formatEther(data);
        }   
        catch(err) {
            console.log(err.message)
        }
    };
    const getBalanceOfInvestortWETH = async() => {
        try {
            const data = await readContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'balanceOf',
                args: [contractInvestorAddress],
            })
            return formatEther(data);
        }   
        catch(err) {
            console.log(err.message)
        }
    };
    useEffect(() => {
        const getBalances = async() => {
            if(!isConnected) return
            const balanceWETHV = await getBalanceOfVaultWETH()
            setBalanceWETHV((balanceWETHV))
            const balanceWETHI = await getBalanceOfInvestortWETH()
            setBalanceWETHI((balanceWETHI))           
        }
        getBalances()
    }, [address]);
    
    return (
        <Flex p='2rem'>

                <Flex direction="column" width='100%'>
                    <Heading as='h2' size='xl' color="white">
                        Balances in the Protocol
                    </Heading>
                    <Text mt='1rem' color="white">{balanceWETHV} WETH in Vault contract</Text>
                    <Text mt='1rem' color="white">{balanceWETHI} WETH in Investor contract</Text>
                </Flex>

        </Flex>
    )
};

export default ProtocolBalances;