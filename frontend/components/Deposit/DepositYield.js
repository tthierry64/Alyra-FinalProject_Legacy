'use client'

// ChakraUI
import { Flex, Alert, AlertIcon, Heading, Input, Button, Text, useToast, Spinner } from '@chakra-ui/react';

// Wagmi
import { prepareWriteContract, writeContract, waitForTransaction, getWalletClient, readContract } from '@wagmi/core';
import { useAccount, usePublicClient } from 'wagmi';

// Contracts informations
import { abiSafetyModule,contractSafetyModuleAddress, abiWETH, contractWETHAddress, abiVault, contractVaultAddress, abiInvestor, abiDAO, contractInvestorAddress, contractDAOAddress} from '@/constants';

// ReactJS
import { useState, useEffect } from 'react';

// Viem
import { formatEther, parseEther, createPublicClient, http, parseAbiItem } from 'viem'
import { hardhat } from 'viem/chains'

const DepositYield = () => {

    // Client Viem
    const config = usePublicClient();

    // Input States
    const [amountWETH, setAmountWETH] = useState([]);

    // State that registers if the current address is the owner
    const [isOwner, setIsOwner] = useState(false);

    // State registering if the component is loading (a spinner will be displayed if it is)
    const [isLoading, setIsLoading] = useState(false);

    // Toast
    const toast = useToast();

    // Account's informations
    const { address, isConnected } = useAccount();

    // Function to Deposit ETH in Yield for investment
    const DepositInvestor = async() => {
        try {
            const _amountWETH = BigInt(parseEther(amountWETH)); 
            const { request } = await prepareWriteContract({
                address: contractInvestorAddress,
                abi: abiInvestor,
                functionName: 'getFromVault', 
                args: [_amountWETH],
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
                hash: hash
            });
            setIsLoading(false);
            toast({
                title: 'Congratulations',
                description: "You have transfered WETH from Vault.",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
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
    
   

    // Verify is user is the owner of the contract
    const getIsOwner = async() => {
        try {
            const data = await readContract({
                address: contractInvestorAddress,
                abi: abiInvestor,
                functionName: 'owner',
            })
            setIsOwner((data === address))
        }
        catch(err) {
            console.log(err.message)
            toast({
                title: 'Error',
                description: "An error occured.",
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    }
    
    // Verify if user is the owner of the contract or a voter whenever the user address changes
    useEffect(() => {
        const call = async() => {await getIsOwner()};
        call();
    }, [address])    
   
    return (
        <Flex p='2rem'>
            {isLoading 
            ? ( <Spinner /> ) 
            : ( isConnected && isOwner ? (
                <Flex direction="column" width='100%'>
                    
                    <Heading as='h2' size='xl' color="white">
                        Deposit WETH in the Investor Contract
                    </Heading>
                    
                    <Flex mt='1rem'>
                        <Input placeholder="Amount in WETH" color="white" value={amountWETH} onChange={(e) => setAmountWETH(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={DepositInvestor}>Deposit</Button>
                    </Flex>

                </Flex>
            ) : (
                <Alert status='warning'>
                    <AlertIcon />
                    Owner please connect your Wallet to the Dapp to make investements.
                </Alert>
            )) }
        </Flex>
    )
};

export default DepositYield;