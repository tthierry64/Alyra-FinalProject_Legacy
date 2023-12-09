'use client'

import { Flex, Text, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer,  Heading, useToast, Spinner } from '@chakra-ui/react'

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

const LocksTable = ({ numberChanged }) => {

    // Client Viem
    const client = usePublicClient();

    // State that will register the number of locks
    const [numberLocks, setNumberLocks] = useState(0);

    // Array that will contain all the locks
    const [locksArray, setLocksArray] = useState([]);

    // State registering if the component is loading (a spinner will be displayed if it is)
    const [isLoading, setIsLoading] = useState(true);

    // Account's informations
    const { address, isConnected } = useAccount();

    // Toast
    const toast = useToast();

    // Array that will contain the components for each lock to display in the table
    const [locksComponents, setLocksComponents] = useState([])

    // Push all the locks in an array
    const getNumberLocks = async () => {
        try {
            if (!isLoading) {
                setLocksArray([])
            }
            setIsLoading(true)
            const data = await readContract({
                address: contractVaultAddress,
                abi: abiVault,
                functionName: 'numberOfLocks',
                args: [address],
            })
            return (data);
        }  
        catch(err) {
            console.log(err.message)
        }
    }
    
    const pushLock = async (i) => {
        try {
            if (!isLoading) {
                setLocksArray([])
            }
            setIsLoading(true)
            const data = await readContract({
                address: contractVaultAddress,
                abi: abiVault,
                functionName: 'locks',
                args: [address, i],
            })
            setLocksArray((prevLock) => [...prevLock, data]);
            if (i === numberLocks) {
                setIsLoading(false)
            }
        }
        catch(err) {
            console.log(err.message)
        }
    }

    // Get all the locks when the number of lock changes
    useEffect(() => {

        for(let i = 1; i <= numberLocks; i++) {
            pushLock(i);
        }
    }, [numberLocks])

    // // Display all the locks on the table
    useEffect(() => {
        console.log(locksArray)
        if (!isLoading) {
            setLocksComponents([])
            for(let i = 0; i < numberLocks; i++) {   
                setLocksComponents((prevComponents) => [...prevComponents, (
                    <Tr key={i + 1}>
                        <Td>{i + 1}</Td>
                        <Td>{locksArray[i].description}</Td>
                    </Tr>
                )])
            }
        }
    }, [isLoading, numberChanged])

    // Getting number of locks
    useEffect(() => {
        const getLocks = async() => {
            if(!isConnected) return
            const numberLocks = await getNumberLocks()
            setNumberLocks((numberLocks))
        }
        getLocks()
    }, [address, numberChanged]);

    return(
        <>
            <Flex direction="column" width='100%'>
                <Text mt='1rem' color="white">Locks : { numberLocks }  </Text>
            </Flex>
            <TableContainer color="white">
                <Table variant='simple' border="2px solid white" color="white">
                    <TableCaption color="white">Locks</TableCaption>
                    <Thead>
                        <Tr>
                            <Th color="white">Amount</Th>
                            <Th color="white">StartTime</Th>
                            <Th color="white">LockDuration</Th>
                            <Th color="white">Beneficiary</Th>
                            <Th color="white">Lock Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {locksComponents}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
}

export default LocksTable;