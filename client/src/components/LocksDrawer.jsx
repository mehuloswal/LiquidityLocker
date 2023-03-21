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

import ERC20LockCard from './ERC20LockCard';
import LPLockCard from './LPLockCard';

import { parse } from '../utils/common/parser';

import ERC20Locker from '../contracts/ERC20Locker.json';
import LPLocker from '../contracts/LPLocker.json';

const lockMapping = [
  { key: 'id', type: 'number' },
  { key: 'tokenAddress', type: 'address' },
  { key: 'ownerAddress', type: 'address' },
  { key: 'amount', type: 'number' },
  { key: 'startDate', type: 'date' },
  { key: 'endDate', type: 'date' },
];

const ERC20LockerABI = ERC20Locker.abi;
const LPLockerABI = LPLocker.abi;

const LocksDrawer = ({ isOpen, onClose }) => {
  const { address, isConnected } = useAccount();

  // -------------------ERC20 Locks
  const { data: returnedERC20Locks, isLoading: isLoadingERC20Locks } =
    useContractRead({
      address: process.env.DEVELOPMENT_ERC20LOCKER_CONTRACT_ADDRESS,
      abi: ERC20LockerABI,
      functionName: 'getMyLocks',
      args: [address],
      enabled: isConnected,
      watch: true,
      onSettled(data, error) {
        console.log('Settled', { data, error });
      },
      onError(err) {},
    });
  // -------------------LP Locks
  const { data: returnedLPLocks, isLoading: isLoadingLPLocks } =
    useContractRead({
      address: process.env.DEVELOPMENT_LPLOCKER_CONTRACT_ADDRESS,
      abi: LPLockerABI,
      functionName: 'getMyLocks',
      args: [address],
      enabled: isConnected,
      watch: true,
      onSettled(data, error) {
        console.log('Settled', { data, error });
      },
      onError(err) {},
    });

  const parsedERC20Data = returnedERC20Locks
    ? parse(returnedERC20Locks, lockMapping)
    : [];
  const parsedLPData = returnedLPLocks
    ? parse(returnedLPLocks, lockMapping)
    : [];

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
                    {isLoadingERC20Locks && (
                      <>
                        <Skeleton height='150px' />
                        <Skeleton height='150px' />
                        <Skeleton height='150px' />
                      </>
                    )}
                    {!isLoadingERC20Locks && parsedERC20Data?.length ? (
                      parsedERC20Data.map(
                        (data) =>
                          data.amount > 0 && (
                            <ERC20LockCard data={data} key={data.id} />
                          )
                      )
                    ) : (
                      <Text as='b' fontSize='3xl' opacity={0.7}>
                        No locks found!
                      </Text>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={2}>
                    {isLoadingLPLocks && (
                      <>
                        <Skeleton height='150px' />
                        <Skeleton height='150px' />
                        <Skeleton height='150px' />
                      </>
                    )}
                    {!isLoadingLPLocks && parsedLPData?.length ? (
                      parsedLPData.map(
                        (data) =>
                          data.amount > 0 && (
                            <LPLockCard data={data} key={data.id} />
                          )
                      )
                    ) : (
                      <Text as='b' fontSize='3xl' opacity={0.7}>
                        No locks found!
                      </Text>
                    )}
                  </VStack>
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
