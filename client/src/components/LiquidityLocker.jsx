import React, { useState } from 'react';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from 'wagmi';
import {
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Stack,
  HStack,
  Select,
  Button,
  useToast,
} from '@chakra-ui/react';
import Header from './Header';
import Locker from '../contracts/Locker.json';
import { useDebounce } from '../utils/hooks/useDebounce';

const LiquidityLocker = () => {
  const toast = useToast();

  const { isConnected } = useAccount();

  const [contractAddress, setContractAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState();
  const [duration, setDuration] = useState();
  const [selector, setSelector] = useState(1);

  const debouncedContractAddress = useDebounce(contractAddress, 500);
  const debouncedTokenAmount = useDebounce(tokenAmount, 500);
  const debouncedDuration = useDebounce(duration, 500);
  const debouncedSelector = useDebounce(selector, 500);

  const LockerABI = Locker.abi;

  const { config: LockerConfig } = usePrepareContractWrite({
    address: '0x8a09816B46B816F54778555e2eDDC53418c58d5d',
    abi: LockerABI,
    functionName: 'createLock',
    args: [
      debouncedContractAddress,
      parseInt(debouncedTokenAmount),
      parseInt(debouncedDuration),
      parseInt(debouncedSelector),
    ],
    enabled: Boolean(
      debouncedContractAddress &&
        debouncedTokenAmount &&
        debouncedDuration &&
        debouncedSelector &&
        isConnected
    ),
    onSettled(data, error) {
      console.log('Settled', { data, error });
    },
    onError(error) {
      !toast.isActive(error.name) &&
        toast({
          id: error.name,
          title: 'Cannot Lock Tokens',
          description:
            'Please enter valid fields. | Please check if you have approved first.',
          status: 'error',
          duration: '5000',
          isClosable: 'true',
          position: 'bottom',
        });
    },
  });
  const { data: lockerData, write: lockerWrite } =
    useContractWrite(LockerConfig);
  const { isLoading: isLockingLoading, isSuccess: isLockingSuccess } =
    useWaitForTransaction({
      hash: lockerData?.hash,
      onSuccess(data, error) {
        !toast.isActive(lockerData.hash) &&
          toast({
            id: lockerData.hash,
            title: 'Locked Successfully',
            description: 'Your Tokens have been locked!',
            status: 'success',
            duration: '5000',
            isClosable: 'true',
            position: 'bottom',
          });
      },
    });

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
                  onChange={(e) => setContractAddress(e.target.value)}
                  value={contractAddress}
                  isDisabled={!isConnected}
                />
                <Input
                  variant='outline'
                  placeholder='Enter Token Amount'
                  onChange={(e) => setTokenAmount(e.target.value)}
                  value={tokenAmount}
                  isDisabled={!isConnected}
                />
                <HStack spacing={8}>
                  <Input
                    variant='outline'
                    placeholder='Enter Duration'
                    onChange={(e) => setDuration(e.target.value)}
                    value={duration}
                    isDisabled={!isConnected}
                  />
                  <Select
                    variant='flushed'
                    colorScheme='blue'
                    onChange={(e) => setSelector(e.target.value)}
                    value={selector}
                    isDisabled={!isConnected}
                  >
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
                  <Button
                    variant='outline'
                    colorScheme='blue'
                    w='full'
                    isDisabled={!isConnected}
                  >
                    Approve
                  </Button>
                  <Button
                    colorScheme='blue'
                    w='full'
                    isDisabled={!lockerWrite || isLockingLoading}
                    onClick={() => lockerWrite?.()}
                  >
                    {isLockingLoading ? 'Locking...' : 'Lock'}
                  </Button>
                </HStack>
              </Stack>
            </TabPanel>
            <TabPanel>Under Construction</TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>
    </Grid>
  );
};

export default LiquidityLocker;
