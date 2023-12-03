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
    const [amountETH, setAmountETH] = useState([]);

    // State that registers if the current address is the owner
    const [isOwner, setIsOwner] = useState(false);

    // State registering if the component is loading (a spinner will be displayed if it is)
    const [isLoading, setIsLoading] = useState(false);

    // Toast
    const toast = useToast();

    // Account's informations
    const { address, isConnected } = useAccount();

    // Function to Deposit ETH in Yield for investment
    const depositETH = async() => {
        try {
            console.log('ok0');
            console.log(address);
            console.log(`${amountETH} ETH to deposit`);
            const invest = Number((amountETH * 80 / 100)); //eth
            const safety = Number((amountETH * 20 / 100)); //eth
            const walletClient = await getWalletClient();
            console.log(`${invest} ETH for invest`);
            console.log(`${safety} ETH for safety`);
             
            const { request1 } = await prepareWriteContract({
                address: contractSafetyModuleAddress,
                abi: abiSafetyModule,
                functionName: 'deposit', //wei
                value: (parseEther(invest)),
                account: address,             
            });
            console.log('ok1');
            const { request2 } = await prepareWriteContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'deposit', //wei
                value: (parseEther(invest)),
                account:address,        
            });            
            console.log('ok2');
            console.log(contractVaultAddress);
            console.log(contractVaultAddress.toString());
            const { request3 } = await prepareWriteContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'approve', //eth
                args: [contractVaultAddress, invest],
            });
            console.log('ok3');
            console.log(address);
            console.log(address);
            const { request4 } = await prepareWriteContract({
                address: contractVaultAddress,
                abi: abiVault,
                functionName: 'deposit', //eth
                args : [invest, address]
            });
            console.log('ok4');            
            const { request5 } = await prepareWriteContract({
                address: contractVaultAddress,
                abi: abiVault,
                functionName: 'approve', //eth
                args: [contractInvestorAddress, invest], //100% ETH to allow manipulate 80% initial balance + interest
            });
            console.log('ok5');            
            const { request6 } = await prepareWriteContract({
                address: contractVaultAddress,
                abi: abiVault,
                functionName: 'transferFrom', //eth
                args: [address, contractInvestorAddress, invest], //100% ETH to allow manipulate 80% initial balance + interest
            });            
            console.log('ok6');
            const { hash } = await writeContract(request1, request2, request3, request4,request5, request6);
            const data = await waitForTransaction({
                hash: hash,
            });
            setIsLoading(false);
            toast({
                title: 'Congratulations',
                description: "You have made your deposit.",
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
                        Deposit WETH in the Yield Contract
                    </Heading>
                    
                    <Flex mt='1rem'>
                        <Input placeholder="Amount in WETH" color="white" value={amountETH} onChange={(e) => setAmountETH(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={depositETH}>Deposit</Button>
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