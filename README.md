LEGACY PROTOCOL

Video of presentation of the dapp  : https://www.loom.com/share/a0dff8979d574c0cacef97ebc55b5a42?t=595&sid=8b8c531a-163d-41ab-ab05-7d7bf1b84611

A learning project

Project Description

Legacy Protocole is a protocol that provides a dapp that combines a vault and a DAO for the user. The purpose of the protocol can be likened to that of a life insurance. It allows a user to add value to the ETH they have. If they wish, they can "lock" a part of the ETH previously deposited to bequeath it to a beneficiary they have previously entered. If the user does not log in regularly, the protocol detects their death and allows the beneficiary to autonomously recover the ETH that has been bequeathed to them. The protocol uses the ETH deposited on other external protocols to realize profits that will be proportionally redistributed to the users.
Smart Contracts

The project uses 9 smart contracts:

    WETH: Manages the conversion of 80% of the deposited ETH into WETH (ERC20) and transfers the remaining 20% into the SafetyModule contract. It allows the management of WETH throughout the protocol's process.
    SafetyModule: Liquidity reserve of the Protocol that allows it to be able to reimburse users if the funds are still locked in the vault.
    Vault: In exchange for WETH, sends vlegETH under the ERC4626 standard. It maintains the concept of proportionality in the vault. It manages the locking of user funds (technically in vlegETH).
    ERC4626Fees: Creates the fees to apply at withdrawal time.
    Investor: Managed by the owner of the Protocol. It recovers the WETH from the vault to invest.
    Yield: Contract that allows simulating a 10% profit on the invested WETH.
    DAO Treasury: Collects the fees and 50% of the profit to finance the protocol.
    DAO: Manages the users of the DAO (users who have therefore locked funds). It manages the sending of LEG Tokens (ERC20) governance tokens of the DAO.
    LEG: Mints the LEG Tokens (ERC20).

Development

The project is developed under Windows 11 using WSL2 and VsCode. The start of the development was done on remix.ethereum.org.
Backend

    Solidity version 0.8.20 for writing smart contracts

Frontend

    Node 20.9.0
    Nextjs 13.5
    Wagmi (to interact with smart contracts)
    Viem
    RainbowKit (to allow connection to a Metamask type wallet)
    Chakra UI (for formatting)

Security

All contracts are developed to 100% and attention has been paid to avoid attacks of type reintrancy and DOS gas limit.  arrays have been removed in favor of mappings of mappings.