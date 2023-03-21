import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Skeleton,
} from '@chakra-ui/react';

import { useContractRead, useAccount } from 'wagmi';
import Locker from '../contracts/Locker.json';
import { parse } from '../utils/common/parser';
import LockCard from './LockCard';

const lockMapping = [
  { key: 'id', type: 'number' },
  { key: 'tokenAddress', type: 'address' },
  { key: 'ownerAddress', type: 'address' },
  { key: 'amount', type: 'number' },
  { key: 'startDate', type: 'date' },
  { key: 'endDate', type: 'date' },
];

const LockerABI = Locker.abi;
const LocksDrawer = ({ isOpen, onClose }) => {
  const { address, isConnected } = useAccount();

  const { data: returnedLocks, isLoading: isLoadingLocks } = useContractRead({
    address: process.env.DEVELOPMENT_LOCKER_CONTRACT_ADDRESS,
    abi: LockerABI,
    functionName: 'getMyLocks',
    args: [address],
    enabled: isConnected,
    watch: true,
    onSettled(data, error) {
      console.log('Settled', { data, error });
    },
    onError(err) {},
  });

  const parsedData = returnedLocks ? parse(returnedLocks, lockMapping) : [];

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        colorScheme='blue'
        size='xl'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>My Locks</DrawerHeader>
          <DrawerBody>
            <Tabs variant='soft-rounded' colorScheme='blue'>
              <TabList>
                <Tab rounded='md'>ERC20 Tokens</Tab>
                <Tab rounded='md'>LP Tokens</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={2}>
                    {isLoadingLocks && (
                      <>
                        <Skeleton height='150px' />
                        <Skeleton height='150px' />
                        <Skeleton height='150px' />
                      </>
                    )}
                    {!isLoadingLocks && parsedData?.length ? (
                      parsedData.map(
                        (data) =>
                          data.amount > 0 && (
                            <LockCard data={data} key={data.id} />
                          )
                      )
                    ) : (
                      <Text>No locks found</Text>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LocksDrawer;
