'use client'
// import Contract from '../../../backend/artifacts/contracts/Bank.sol'
import { Flex, Alert, AlertIcon, Heading, Input, Button, Text, useToast, Spinner } from '@chakra-ui/react'

// Wagmi
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { useAccount, usePublicClient } from 'wagmi'

// Contracts informations
import { abiDAO, abiVault, abiWETH, contractDAOAddress, contractVaultAddress, contractWETHAddress } from '@/constants';;

// ReactJS
import { useState, useEffect } from 'react'

// Viem
import { formatEther, parseEther, createPublicClient, http, parseAbiItem } from 'viem'
import { hardhat } from 'viem/chains'

const Balances = () => {

    // Client Viem
    const client = usePublicClient();

    // Balance of the user State
    const [balanceETH, setBalanceETH] = useState(0);
    const [balancevlegETH, setBalancevlegETH] = useState(0);
    const [balanceLockedETH, setBalanceLockedETH] = useState(0);
    const [balanceLEG, setBalanceLEG] = useState(0);

    // IsLoading 
    const [isLoading, setIsLoading] = useState(false);

    // Toast
    const toast = useToast();

    // Account's informations
    const { address, isConnected } = useAccount();

    // Get the different balances of the user
    const getBalanceOfUserETH = async() => {
        try {
            const data = await readContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'balanceOf', //wei
                args: [address],
            })
            return (data);
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
                functionName: 'balanceOf', //eth
                args: [address],
            })
            return (data);
            // return formatEther(data);
        }   
        catch(err) {
            console.log(err.message)
        }
    };
    
    // const getBalanceOfUserLEG = async() => {
    //     try {
    //         const data = await readContract({
    //             address: contractDAOAddress,
    //             abi: abiDAO,
    //             functionName: 'getBalanceLEG',
    //             args: [address],
    //         })
    //         return formatEther(data);
    //     }   
    //     catch(err) {
    //         console.log(err.message)
    //     }
    // };   

    // const getBalanceOfUserLockedETH = async() => {
    //     try {
    //         const data = await readContract({
    //             address: contractDAOAddress,
    //             abi: abiDAO,
    //             functionName: 'getBalanceWETHLocked',
    //             args: [address],
    //         })
    //         return formatEther(data);
    //     }   
    //     catch(err) {
    //         console.log(err.message)
    //     }
    // };
    
    useEffect(() => {
        const getBalances = async() => {
            if(!isConnected) return
            const balanceETH = await getBalanceOfUserETH()
            setBalanceETH((balanceETH))
            const balancevlegETH = await getBalanceOfUservlegETH()
            setBalancevlegETH((balancevlegETH))
            // const balanceLockedETH = await getBalanceOfUserLockedETH()
            // setBalanceLockedETH((balanceLockedETH))
            // const balanceLEG = await getBalanceOfUserLEG()
            // setBalanceLEG((balanceLEG))
        }
        getBalances()
    }, [address]);
    
    return (
        <Flex p='2rem'>
            {isLoading 
            ? ( <Spinner /> ) 
            : ( isConnected ? (
                <Flex direction="column" width='100%'>
                    <Heading as='h2' size='xl' color="white">
                        Your balances in the Protocol
                    </Heading>
                    <Text mt='1rem' color="white">{balanceETH} ETH</Text>
                    <Text mt='1rem' color="white">{balancevlegETH} vlegETH</Text>
                    {/* <Text mt='1rem' color="white">{balanceLockedETH} locked ETH</Text>
                    <Text mt='1rem' color="white">{balanceLEG} LEG</Text> */}

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

export default Balances;