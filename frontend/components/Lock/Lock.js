'use client'

// ChakraUI
import { Flex, Alert, AlertIcon, Heading, Input, Button, Box, useToast, Spinner } from '@chakra-ui/react';

// Wagmi
import { prepareWriteContract, writeContract, waitForTransaction, getWalletClient } from '@wagmi/core';
import { useAccount, usePublicClient } from 'wagmi';

// Contracts informations
import { abiSafetyModule,contractSafetyModuleAddress, abiWETH, contractWETHAddress, abiVault, contractVaultAddress, abiInvestor, abiDAO, contractInvestorAddress, contractDAOAddress, ownerAddress} from '@/constants';

// ReactJS
import { useState, useEffect } from 'react';

// Viem
import { formatEther, parseEther, createPublicClient, http, parseAbiItem } from 'viem'
import { hardhat } from 'viem/chains'

const Lock = ({ setNumberChanged }) => {

    // Client Viem
    const config = usePublicClient();

    // Input States
    const [amountETH, setAmountETH] = useState([]);
    const [approveWETH, setApproveWETH] = useState([]);
    const [amountvlegETH, setAmountVlegETH] = useState([]);
    const [amountToLock, setAmountToLock] = useState([]);
    const [lockDuration, setlockDuration] = useState([]);
    const [beneficiary, setbeneficiary] = useState([]);


    // State registering if the component is loading (a spinner will be displayed if it is)
    const [isLoading, setIsLoading] = useState(false);

    // Toast
    const toast = useToast();

    // Account's informations
    const { address, isConnected } = useAccount();

    // Function to deposit ETH in different contracts of Protocole

    const LockWETH = async() => {
        try {
            const _amountToLock = BigInt(parseEther(amountToLock)); 
            const { request } = await prepareWriteContract({
                address: contractVaultAddress,
                abi: abiVault,
                functionName: 'lockTokens',
                args : [_amountToLock, lockDuration, beneficiary],            
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
                hash: hash
            });
            setIsLoading(false);
            toast({
                title: 'Congratulations',
                description: "You have locked ETH in the Protocol.",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
            setNumberChanged(i => i+1);     
        }
        catch(err) {
            console.log(err.message)
            setIsLoading(false)
            toast({
                title: 'Error',
                description: "An error occured.",
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }  
    };

    return (
        <Flex p='2rem'>
            {isLoading 
            ? ( <Spinner /> ) 
            : ( isConnected ? (
                <Flex direction="column" width='100%'>
                    
                    <Heading as='h2' size='xl' color="white">
                        Lock WETH for Legacy and get LEG tokens
                    </Heading>
                    <Heading as='h1' size='l' color="white">
                        Specify the amount, the duration of lock : 1, 3, 6 or 9 years and the beneficiary
                    </Heading>
                    
                    <Flex mt='1rem'>
                        <Input placeholder="Amount of you want to lock" color="white" value={amountToLock} onChange={(e) => setAmountToLock(e.target.value)}  />
                    </Flex>
                    <Flex mt='1rem'>
                        <Input placeholder="Duration of lock : 1, 3, 6 or 9 years" color="white" value={lockDuration} onChange={(e) => setlockDuration(e.target.value)}  />
                    </Flex>                    
                    <Flex mt='1rem'>
                        <Input placeholder="Address of yout beneficiary" color="white" value={beneficiary} onChange={(e) => setbeneficiary(e.target.value)}  />
                    </Flex>
                    <Box display="flex" justifyContent="flex-end">
                        <Button mt='1rem' borderColor="black" borderWidth="1px" color="black" bg="red" onClick={LockWETH}>Lock</Button>
                    </Box>                    
                </Flex>
            ) : (
                <Alert status='warning'>
                    <AlertIcon />
                    Please connect your Wallet to our Dapp.
                </Alert>
            )) }
        </Flex>
    )
};

export default Lock;