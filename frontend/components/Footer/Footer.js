import React from 'react';
import { Box, Flex, Text, extendTheme  } from '@chakra-ui/react';


const Footer = () => {
  
  return (
   <Box as="footer" p={4}>
     <Flex 
       justifyContent="center" 
       alignItems="center" 
       bgGradient="linear(90deg, rgba(2,0,36,1) 0%, rgba(6,109,130,1) 100%, rgba(0,212,255,1) 100%)"
     >
       <Text fontSize="md" fontWeight="bold" color="white">
         © 2023 # ALYRA # - Legacy Protocol - Développé par Marième (Consultante), Baptiste (Consultant), Thomas (DeFi), Thomas (Developpeur)
       </Text>
     </Flex>
   </Box>
  );
 };
 
 

export default Footer;