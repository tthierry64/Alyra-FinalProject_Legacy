'use client'

// RainbowKit
import { ConnectButton } from "@rainbow-me/rainbowkit";

// ChakraUI
import { Flex, Heading } from "@chakra-ui/react";

// Nextjs
import Image from "next/image";

const Header = () => {
  return (
    <Flex 
        p="2rem" 
        justifyContent="space-between" 
        alignContent="center">
        <Image
          src="/Logo/logo.png"
          alt="Logo"
          width={60}
          height={60}
        />
        <Heading as='h2' size='xl' color="white"> Legacy Protocol </Heading>
        <ConnectButton label="Connect your Wallet"/>
    </Flex>
)
}
export default Header;