'use client'

// ChakraUI
import { Flex, Alert, AlertIcon, Heading, Input, Button, Text, useToast, Spinner } from '@chakra-ui/react';

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

const Deposit = ({ setNumberChanged }) => {

    // Client Viem
    const config = usePublicClient();

    // Input States
    const [amountETH, setAmountETH] = useState([]);
    const [approveWETH, setApproveWETH] = useState([]);
    const [amountvlegETH, setAmountVlegETH] = useState([]);
    const [approveInvestor, setApproveInvestor] = useState([]);

    // State registering if the component is loading (a spinner will be displayed if it is)
    const [isLoading, setIsLoading] = useState(false);

    // Toast
    const toast = useToast();

    // Account's informations
    const { address, isConnected } = useAccount();

    // Function to deposit ETH in different contracts of Protocole
    const MintWETH = async() => {
        try {
            const _amountETH = BigInt(parseEther(amountETH)); 
            const { request } = await prepareWriteContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'deposit',
                value: _amountETH,
                account: address,             
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
                hash: hash
            });
            setIsLoading(false);
            toast({
                title: 'Congratulations',
                description: "You have made mint your WETH.",
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
    
    const ApproveVault = async() => {
        try {
            const _approveWETH = BigInt(parseEther(approveWETH)); 
            const { request } = await prepareWriteContract({
                address: contractWETHAddress,
                abi: abiWETH,
                functionName: 'approve', 
                args: [contractVaultAddress, _approveWETH],
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
   
    const MintvlegWETH = async() => {
        try {
            const _amountvlegETH = BigInt(parseEther(amountvlegETH)); 
            const { request } = await prepareWriteContract({
                address: contractVaultAddress,
                abi: abiVault,
                functionName: 'deposit',
                args : [_amountvlegETH, address],            
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
                hash: hash
            });
            setIsLoading(false);
            toast({
                title: 'Congratulations',
                description: "You have made mint your vlegETH.",
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
                        Deposit ETH in the vault
                    </Heading>
                    
                    <Flex mt='1rem'>
                        <Input placeholder="Amount of ETH to mint in WETH  -  20% are send to the SafetyModule" color="white" value={amountETH} onChange={(e) => setAmountETH(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={MintWETH}>Mint WETH</Button>
                    </Flex>
                    <Flex mt='1rem'>
                        <Input placeholder="Amount of WETH to approve to Vault" color="white" value={approveWETH} onChange={(e) => setApproveWETH(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={ApproveVault}>Allow Invest</Button>
                    </Flex>                    
                    <Flex mt='1rem'>
                        <Input placeholder="Amount of vlegETH to mint in WETH" color="white" value={amountvlegETH} onChange={(e) => setAmountVlegETH(e.target.value)}  />
                        <Button borderColor="black" borderWidth="1px" color="black" bg="#24c89f" onClick={MintvlegWETH}>Mint vlegETH</Button>
                    </Flex>                    
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

export default Deposit;