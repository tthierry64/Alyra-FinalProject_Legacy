'use client'

// ChakraUI
import { ChakraProvider } from '@chakra-ui/react'

// CSS
import './globals.css'

// RainbowKit
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Wagmi
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


// :::::::::::::::::::::::CONFIGURATION::::::::::::::::::::::::::::::: //

const { chains, publicClient } = configureChains(
  [hardhat, sepolia],
  [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
      publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'aee769a5b5f09e3eac9c312014288797',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})


// ::::::::::::::::::::::::::RENDER::::::::::::::::::::::::::::::::::: //

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider 
            chains={chains} 
            theme={darkTheme()}
            >
            <ChakraProvider>
              {children}
            </ChakraProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
