// Components
import Header from "@/components/Header/Header"
import Deposit from "@/components/Deposit/Deposit"
import DepositYield from "@/components/Deposit/DepositYield"
import Balances from "@/components/Balances/Balances"
import { Box } from "@chakra-ui/react"

export default function Home() {
  return (
    <Box minHeight="100vh" bgGradient="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(6,109,130,1) 100%, rgba(0,212,255,1) 100%)">
      <Header />
      <Balances />
      <Deposit />
      <DepositYield />
    </Box>
  )
}