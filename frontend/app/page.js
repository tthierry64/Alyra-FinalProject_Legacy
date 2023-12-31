'use client'
// ReactJS
import { useState, useEffect } from 'react';

// Components
import Header from "@/components/Header/Header"
import Deposit from "@/components/Deposit/Deposit"
import Lock from "@/components/Lock/Lock"
import DepositYield from "@/components/Deposit/DepositYield"
import UsersBalances from "@/components/Balances/UsersBalances"
import ProtocolBalances from "@/components/Balances/ProtocolBalances"
import LocksTable from "@/components/Lock/LocksTable"
import Footer from "@/components/Footer/Footer"
import { Box } from "@chakra-ui/react"



export default function Home() {

  const [numberChanged, setNumberChanged] = useState(0);

  return (
    <Box minHeight="100vh" bgGradient="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(6,109,130,1) 100%, rgba(0,212,255,1) 100%)">
      <Header />
      <ProtocolBalances numberChanged={numberChanged}/>
      <UsersBalances numberChanged={numberChanged}/>
      <Deposit setNumberChanged={setNumberChanged}/>
      <Lock setNumberChanged={setNumberChanged}/>
      <LocksTable numberChanged={numberChanged}/>
      <DepositYield setNumberChanged={setNumberChanged}/>
      <Footer />
    </Box>
  )
}