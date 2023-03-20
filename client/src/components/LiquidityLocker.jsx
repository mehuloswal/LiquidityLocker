import React, { useState } from 'react';

import {
  Box,
  Center,
  Container,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Stack,
  VStack,
  HStack,
  Select,
  Button,
} from '@chakra-ui/react';
import Header from './Header';

const LiquidityLocker = () => {
  return (
    <Grid gap={5} templateRows='repeat(3,1fr)' placeItems='center'>
      <GridItem w='100%' h='100%' rowSpan={1}>
        <Header />
      </GridItem>
      <GridItem
        p='1rem'
        w='50%'
        border='1px'
        borderColor='blackAlpha.300'
        borderRadius='2xl'
        boxShadow='md'
        rowSpan={2}
      >
        <Tabs variant='enclosed' colorScheme='blue'>
          <TabList>
            <Tab>ERC20 Tokens</Tab>
            <Tab>LP Tokens</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack spacing={3}>
                <Input
                  variant='outline'
                  placeholder='Enter Token Contract Address'
                  required
                />
                <Input variant='outline' placeholder='Enter Token Amount' />
                <HStack spacing={8}>
                  <Input variant='outline' placeholder='Enter Duration' />
                  <Select variant='flushed' colorScheme='blue'>
                    <option value={1}>Seconds</option>
                    <option value={2}>Minutes</option>
                    <option value={3}>Hours</option>
                    <option value={4}>Days</option>
                    <option value={5}>Weeks</option>
                    <option value={6}>Months</option>
                    <option value={7}>Years</option>
                  </Select>
                </HStack>
                <HStack pt={4}>
                  <Button variant='outline' colorScheme='blue' w='full'>
                    Approve
                  </Button>
                  <Button colorScheme='blue' w='full'>
                    Lock
                  </Button>
                </HStack>
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack spacing={3}>
                <Input
                  variant='outline'
                  placeholder='Enter Token Contract Address'
                  required
                />
                <Input variant='outline' placeholder='Enter Token Amount' />
                <HStack spacing={8}>
                  <Input variant='outline' placeholder='Enter Duration' />
                  <Select variant='flushed' colorScheme='blue'>
                    <option value={1}>Seconds</option>
                    <option value={2}>Minutes</option>
                    <option value={3}>Hours</option>
                    <option value={4}>Days</option>
                    <option value={5}>Weeks</option>
                    <option value={6}>Months</option>
                    <option value={7}>Years</option>
                  </Select>
                </HStack>
                <HStack pt={4}>
                  <Button colorScheme='blue' w='full'>
                    Approve
                  </Button>
                  <Button colorScheme='blue' w='full'>
                    Lock
                  </Button>
                </HStack>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>
    </Grid>
  );
};

export default LiquidityLocker;
