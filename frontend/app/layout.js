'use client'

// ChakraUI
import { ChakraProvider } from '@chakra-ui/react'

// CSS
import './globals.css'

// RainbowKit
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import '@rainbow-me/rainbowkit/styles.css';

// Wagmi
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';


// :::::::::::::::::::::::CONFIGURATION::::::::::::::::::::::::::::::: //

const { chains, publicClient } = configureChains(
  [hardhat],
  // [hardhat, sepolia],
  [
      // alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
      publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'e17d2490a040e04714e692c25b9c2c9a',
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
