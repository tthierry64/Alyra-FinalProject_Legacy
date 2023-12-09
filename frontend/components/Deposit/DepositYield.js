'use client'

// ChakraUI
import { Flex, Alert, AlertIcon, Heading, Input, Button, Text, useToast, Spinner, Box } from '@chakra-ui/react';

// Wagmi
import { prepareWriteContract, writeContract, waitForTransaction, getWalletClient, readContract } from '@wagmi/core';
import { useAccount, usePublicClient } from 'wagmi';

// Contracts informations
import { abiSafetyModule,contractSafetyModuleAddress, abiWETH, contractWETHAddress, abiVault, contractVaultAddress, abiInvestor, abiDAO, contractInvestorAddress, contractDAOAddress, abiYield, contractYieldAddress}  from '@/constants';

// ReactJS
import { useState, useEffect } from 'react';

// Viem
import { formatEther, parseEther, createPublicClient, http, parseAbiItem } from 'viem'
import { hardhat } from 'viem/chains'

const DepositYield = ({ setNumberChanged }) => {

    // Client Viem
    const config = usePublicClient();

    // Input Statesinvest
    const [investContract, setInvestContract] = useState([]);
    const [amountWETH, setAmountWETH] = useState([]);
    const [approveWETH, setApproveWETH] = useState([]);
    const [WETHToInvest, setWETHToInvest] = useState([]);

    // State that registers if the current address is the owner
    const [isOwner, setIsOwner] = useState(false);

    // State registering if the component is loading (a spinner will be displayed if it is)
    const [isLoading, setIsLoading] = useState(false);

    // Toast
    const toast = useToast();

    // Account's informations
    const { address, isConnected } = useAccount();

    // Function to Deposit ETH in Yield for investment
    const ApproveInvestor = async() => {
        try {
            const _amountWETH = BigInt(parseEther(approveWETH)); 
            const { request } = await prepareWriteContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'approved', 
                args: [contractVaultAddress, _amountWETH],
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
                hash: hash
            });
            setIsLoading(false);
            toast({
                title: 'Congratulations',
                description: "You have made your approval.",
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
    const ApproveYield = async() => {
        try {
            const _amountWETH = BigInt(parseEther(approveWETH)); 
            const { request } = await prepareWriteContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'approved', 
                args: [contractYieldAddress, _amountWETH],
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
                hash: hash
            });
            setIsLoading(false);
            toast({
                title: 'Congratulations',
                description: "You have made your approval.",
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

    const DepositInvestor = async() => {
        try {
            const _amountWETH = BigInt(parseEther(WETHToInvest)); 
            const { request } = await prepareWriteContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'transferFrom', 
                args: [contractVaultAddress, contractInvestorAddress, _amountWETH],
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
            setNumberChanged(i => i+1) 
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

    const DepositYield = async() => {
        try {
            const _amountWETH = BigInt(parseEther(amountWETH)); 
            const { request } = await prepareWriteContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'transferFrom', 
                args: [contractInvestorAddress, contractYieldAddress, _amountWETH],
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
    
    const SelectAddress = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractInvestorAddress,
                abi: abiInvestor,
                functionName: 'sendTokensToYield', 
                args: [investContract],
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
                hash: hash
            });
            setIsLoading(false);
            toast({
                title: 'Congratulations',
                description: "You have registred a yield address contract.",
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

    const InvestYield = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractYieldAddress,
                abi: abiYield,
                functionName: 'addInterest', 
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
                hash: hash
            });
            setIsLoading(false);
            toast({
                title: 'Congratulations',
                description: "You have made a profitable investment.",
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
                        Choose your type of invesment and transfer WETH
                    </Heading>
                    <Flex mt='1rem'>
                        <Input placeholder="Address of the investment contract" color="white" value={investContract} onChange={(e) => setInvestContract(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={SelectAddress}>Set</Button>
                    </Flex> 
                    <Flex mt='1rem'>
                        <Input placeholder="Amount of WETH to approve to Investor" color="white" value={approveWETH} onChange={(e) => setApproveWETH(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={ApproveInvestor}>Allow Invest</Button>
                    </Flex>
                    <Flex mt='1rem'>
                        <Input placeholder="Address of the investment contract" color="white" value={WETHToInvest} onChange={(e) => setWETHToInvest(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={DepositInvestor}>Deposit</Button>
                    </Flex>                                         
                    <Flex mt='1rem'>
                        <Input placeholder="Amount of WETH to approve to Yield Contract" color="white" value={approveWETH} onChange={(e) => setApproveWETH(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={ApproveYield}>Allow Invest</Button>
                    </Flex>                    
                    <Flex mt='1rem'>
                        <Input placeholder="Amount in WETH" color="white" value={amountWETH} onChange={(e) => setAmountWETH(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={DepositYield}>Deposit</Button>
                    </Flex>
                    <Box display="flex" justifyContent="flex-end">
                        <Button mt='1rem' borderColor="black" borderWidth="1px" color="black" bg="red" onClick={InvestYield}>Invest</Button>
                    </Box>
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