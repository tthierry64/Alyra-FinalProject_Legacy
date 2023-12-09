'use client'

// ChakraUI
import { Heading, useToast, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Flex, Text, Spinner } from '@chakra-ui/react'

// Wagmi
import { readContract, getWalletClient } from '@wagmi/core';
import { useAccount, usePublicClient } from 'wagmi';

// Contracts informations
import { abiVault, contractVaultAddress } from '@/constants';

// Reactjs
import { useState, useEffect } from 'react';

// Viem
import { parseAbiItem } from 'viem';

const LocksTable = ({ numberChanged }) => {

    // Account's informations
    const { address } = useAccount();

    // Client Viem
    const client = usePublicClient();

    // State that will register the number of proposals
    const [numberLocks, setNumberLocks] = useState(0);

    // Array that will contain all the proposals
    const [locksArray, setLocksArray] = useState([]);

    // State registering if the component is loading (a spinner will be displayed if it is)
    const [isLoading, setIsLoading] = useState(true);

    // Toast
    const toast = useToast();

    // Array that will contain the components for each proposal to display in the table
    const [locksComponents, setLocksComponents] = useState([])

    // Push all the locks in an array
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

    // Display all the proposals on the table
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
    }, [isLoading])

    // Getting number of proposals (used to bound the for loop)
    useEffect(() => {
        const getEvents = async() => {
            const registeredLogs = await client.getLogs({  
                address: contractAddress,
                event: parseAbiItem('event ProposalRegistered(uint proposalId)'),
                // fromBlock :0n,                
                fromBlock: BigInt(Number(await client.getBlockNumber()) - 15000),
                toBlock: 'latest'
            })
            setNumberLocks(registeredLogs.length);
        }
        getEvents();
    }, [])

    return(
        <>
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