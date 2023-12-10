'use client'

import { Flex, Alert, AlertIcon, Heading, Input, Button, Text, useToast, Spinner } from '@chakra-ui/react'

// Wagmi
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { useAccount, usePublicClient } from 'wagmi'

// Contracts informations
import { abiSafetyModule, abiVault, abiWETH, abiLEG, contractLEGAddress, contractSafetyModuleAddress, contractVaultAddress, contractWETHAddress } from '@/constants';;

// ReactJS
import { useState, useEffect } from 'react'

// Viem
import { formatEther, parseEther, createPublicClient, http, parseAbiItem, client} from 'viem'
import { hardhat } from 'viem/chains'

const UsersBalances = ({ numberChanged } ) => {

    // Client Viem
    const client = usePublicClient();

    // Balance of the user State
    const [balanceWETH, setBalanceWETH] = useState(0);
    const [balanceSafety, setBalanceSafety] = useState(0);    
    const [allowanceVault, setAllowanceVault] = useState(0);
    const [balancevlegETH, setBalancevlegETH] = useState(0);   
    const [balanceLockedETH, setBalanceLockedETH] = useState(0);
    const [balanceLEG, setBalanceLEG] = useState(0);

    // IsLoading 
    const [isLoading, setIsLoading] = useState(false);

    // // Toast
    // const toast = useToast();

    // Account's informations
    const { address, isConnected } = useAccount();

    // Get the different balances of the user
    const getBalanceOfUserWETH = async() => {
        try {
            const data = await readContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'balanceOf',
                args: [address],
            })
            return formatEther(data);
        }   
        catch(err) {
            console.log(err.message)
        }
    };

    const getBalanceOfUserSafety = async() => {
        try {
            const data = await readContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'getETHSafe',
                args: [address]
            }) 
            return formatEther(data);
        }   
        catch(err) {
            console.log(err.message)
        }
    };    

    const getAllowanceVault = async() => {
        try {
            const data = await readContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'allowance',
                args: [address, contractVaultAddress],
            })
            return formatEther(data);

        }   
        catch(err) {
            console.log(err.message)
        }
    };

    const getBalanceOfUservlegETH = async() => {
        try {
            const data = await readContract({
                address: contractVaultAddress,
                abi: abiVault,
                functionName: 'balanceOf',
                args: [address],
            })
            return formatEther(data);
            // return formatEther(data);
        }   
        catch(err) {
            console.log(err.message)
        }
    };

    const getBalanceOfUserLock = async() => {
        try {
            const data = await readContract({
                address: contractVaultAddress,
                abi: abiVault,
                functionName: 'totalLocked',
                args: [address],
            })
            return formatEther(data);
            // return formatEther(data);
        }   
        catch(err) {
            console.log(err.message)
        }
    };

    const getBalanceOfLEG = async() => {
        try {
            const data = await readContract({
                address: contractLEGAddress,
                abi: abiLEG,
                functionName: 'totalLocked',
                args: [address],
            })
            return formatEther(data);
            // return formatEther(data);
        }   
        catch(err) {
            console.log(err.message)
        }
    };    

    useEffect(() => {
        const getBalances = async() => {
            if(!isConnected) return
            const balanceWETH = await getBalanceOfUserWETH()
            setBalanceWETH((balanceWETH))
            const balanceSafety = await getBalanceOfUserSafety()
            setBalanceSafety((balanceSafety))
            const allowanceVault = await getAllowanceVault()
            setAllowanceVault((allowanceVault))            
            const balancevlegETH = await getBalanceOfUservlegETH()
            setBalancevlegETH((balancevlegETH))
            const balanceLockedETH = await getBalanceOfUserLock()
            setBalanceLockedETH((balanceLockedETH))
            const balanceLEG = await getBalanceOfUserLock()
            setBalanceLEG((balanceLEG))        
        }
        getBalances()
    }, [address, numberChanged]);
    
    return (
        <Flex p='2rem'>
            {isLoading 
            ? ( <Spinner /> ) 
            : ( isConnected ? (
                <Flex direction="column" width='100%'>
                    <Heading as='h2' size='xl' color="white">
                        Your balances in the Protocol
                    </Heading>
                    <Text mt='1rem' color="white">{balanceWETH} WETH</Text>
                    <Text mt='1rem' color="white">{balanceSafety} ETH in safetyModule</Text>                    
                    <Text mt='1rem' color="white">{allowanceVault} Currently allowed to Vault contract</Text>
                    <Text mt='1rem' color="white">{balancevlegETH} vlegETH</Text>
                    <Text mt='1rem' color="white">{balancevlegETH} available ETH to lock</Text>
                    <Text mt='1rem' color="white">{balanceLockedETH} locked ETH</Text>
                    <Text mt='1rem' color="white">{balanceLEG} LEG</Text>


                </Flex>
            ) : (
                <Alert status='warning'>
                    <AlertIcon />
                    Please connect your Wallet to see your balances.
                </Alert>
            )) }
        </Flex>
    )
};

export default UsersBalances;