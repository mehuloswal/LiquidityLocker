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
  Badge,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import Header from './Header';
import { useDebounce } from '../utils/hooks/useDebounce';
import ERC20Locker from '../contracts/ERC20Locker.json';
import LPLocker from '../contracts/LPLocker.json';
import IERC20 from '../contracts/IERC20.json';

const LiquidityLocker = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const { isConnected } = useAccount();

  const [erc20ContractAddress, setErc20ContractAddress] = useState('');
  const [erc20TokenAmount, setErc20TokenAmount] = useState();
  const [erc20Duration, setErc20Duration] = useState();
  const [erc20Selector, setErc20Selector] = useState(1);

  const [lpContractAddress, setLpContractAddress] = useState('');
  const [lpTokenAmount, setLpTokenAmount] = useState();
  const [lpDuration, setLpDuration] = useState();
  const [lpSelector, setLpSelector] = useState(1);

  const erc20DebouncedContractAddress = useDebounce(erc20ContractAddress, 500);
  const erc20DebouncedTokenAmount = useDebounce(erc20TokenAmount, 500);
  const erc20DebouncedDuration = useDebounce(erc20Duration, 500);
  const erc20DebouncedSelector = useDebounce(erc20Selector, 500);

  const lpDebouncedContractAddress = useDebounce(lpContractAddress, 500);
  const lpDebouncedTokenAmount = useDebounce(lpTokenAmount, 500);
  const lpDebouncedDuration = useDebounce(lpDuration, 500);
  const lpDebouncedSelector = useDebounce(lpSelector, 500);

  const ERC20LockerABI = ERC20Locker.abi;
  const LPLockerABI = LPLocker.abi;
  const IERC20ABI = IERC20.abi;

  //-------------------ERC20 Locker
  const { config: erc20LockerConfig } = usePrepareContractWrite({
    address: process.env.DEVELOPMENT_ERC20LOCKER_CONTRACT_ADDRESS,
    abi: ERC20LockerABI,
    functionName: 'createLock',
    args: [
      erc20DebouncedContractAddress,
      parseInt(erc20DebouncedTokenAmount),
      parseInt(erc20DebouncedDuration),
      parseInt(erc20DebouncedSelector),
    ],
    enabled: Boolean(
      erc20DebouncedContractAddress &&
        erc20DebouncedTokenAmount &&
        erc20DebouncedDuration &&
        erc20DebouncedSelector &&
        isConnected
    ),
    onSettled(data, error) {
      console.log('Settled ERC20 locker', { data, error });
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
  const { data: erc20LockerData, write: erc20LockerWrite } =
    useContractWrite(erc20LockerConfig);
  const { isLoading: isErc20LockingLoading } = useWaitForTransaction({
    hash: erc20LockerData?.hash,
    onSuccess(data, error) {
      !toast.isActive(erc20LockerData.hash) &&
        toast({
          id: erc20LockerData.hash,
          title: 'Locked Successfully',
          description: 'Your Tokens have been locked!',
          status: 'success',
          duration: '5000',
          isClosable: 'true',
          position: 'bottom',
        });
    },
  });

  // ----------------------LPLocker
  const { config: lpLockerConfig } = usePrepareContractWrite({
    address: process.env.DEVELOPMENT_LPLOCKER_CONTRACT_ADDRESS,
    abi: LPLockerABI,
    functionName: 'createLock',
    args: [
      lpDebouncedContractAddress,
      parseInt(lpDebouncedTokenAmount),
      parseInt(lpDebouncedDuration),
      parseInt(lpDebouncedSelector),
    ],
    enabled: Boolean(
      lpDebouncedContractAddress &&
        lpDebouncedTokenAmount &&
        lpDebouncedDuration &&
        lpDebouncedSelector &&
        isConnected
    ),
    onSettled(data, error) {
      console.log('Settled LP Locker', { data, error });
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
  const { data: lpLockerData, write: lpLockerWrite } =
    useContractWrite(lpLockerConfig);
  const { isLoading: isLpLockingLoading } = useWaitForTransaction({
    hash: lpLockerData?.hash,
    onSuccess(data, error) {
      !toast.isActive(lpLockerData.hash) &&
        toast({
          id: lpLockerData.hash,
          title: 'Locked Successfully',
          description: 'Your Tokens have been locked!',
          status: 'success',
          duration: '5000',
          isClosable: 'true',
          position: 'bottom',
        });
    },
  });

  //---------------------- ERC20 Approval

  const { config: ERC20Config } = usePrepareContractWrite({
    address: erc20ContractAddress,
    abi: IERC20ABI,
    functionName: 'approve',
    args: [
      process.env.DEVELOPMENT_ERC20LOCKER_CONTRACT_ADDRESS,
      parseInt(erc20DebouncedTokenAmount),
    ],
    enabled: Boolean(
      erc20DebouncedContractAddress && erc20DebouncedTokenAmount && isConnected
    ),
    onSettled(data, error) {
      console.log('Settled ERC20 Approval', { data, error });
    },
  });
  const { data: ERC20Data, write: ERC20Write } = useContractWrite(ERC20Config);
  const { isLoading: isErc20ApprovingLoading } = useWaitForTransaction({
    hash: ERC20Data?.hash,
    onSuccess(data, error) {
      !toast.isActive(ERC20Data.hash) &&
        toast({
          id: ERC20Data.hash,
          title: 'Approved Successfully',
          description: 'Tokens Approved Successfully',
          status: 'info',
          duration: '5000',
          isClosable: 'true',
          position: 'bottom',
        });
    },
  });
  //---------------------- LP Approval

  const { config: LPConfig } = usePrepareContractWrite({
    address: lpContractAddress,
    abi: IERC20ABI,
    functionName: 'approve',
    args: [
      process.env.DEVELOPMENT_LPLOCKER_CONTRACT_ADDRESS,
      parseInt(lpDebouncedTokenAmount),
    ],
    enabled: Boolean(
      lpDebouncedContractAddress && lpDebouncedTokenAmount && isConnected
    ),
    onSettled(data, error) {
      console.log('Settled LP Approval', { data, error });
    },
  });
  const { data: LPData, write: LPWrite } = useContractWrite(LPConfig);
  const { isLoading: isLpApprovingLoading } = useWaitForTransaction({
    hash: LPData?.hash,
    onSuccess(data, error) {
      !toast.isActive(LPData.hash) &&
        toast({
          id: LPData.hash,
          title: 'Approved Successfully',
          description: 'Tokens Approved Successfully',
          status: 'info',
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
        borderColor={
          colorMode === 'light' ? 'blackAlpha.300' : 'blackAlpha.700'
        }
        bgColor={colorMode === 'dark' ? 'blackAlpha.200' : ' '}
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
                  onChange={(e) => setErc20ContractAddress(e.target.value)}
                  value={erc20ContractAddress}
                  isDisabled={!isConnected}
                />
                <Input
                  variant='outline'
                  placeholder='Enter Token Amount'
                  onChange={(e) => setErc20TokenAmount(e.target.value)}
                  value={erc20TokenAmount}
                  isDisabled={!isConnected}
                />
                <HStack spacing={8}>
                  <Input
                    variant='outline'
                    placeholder='Enter Duration'
                    onChange={(e) => setErc20Duration(e.target.value)}
                    value={erc20Duration}
                    isDisabled={!isConnected}
                  />
                  <Select
                    variant='flushed'
                    colorScheme='blue'
                    onChange={(e) => setErc20Selector(e.target.value)}
                    value={erc20Selector}
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
                    isDisabled={!ERC20Write || isErc20ApprovingLoading}
                    onClick={() => ERC20Write?.()}
                  >
                    {isErc20ApprovingLoading ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    colorScheme='blue'
                    w='full'
                    isDisabled={!erc20LockerWrite || isErc20LockingLoading}
                    onClick={() => erc20LockerWrite?.()}
                  >
                    {isErc20LockingLoading ? 'Locking...' : 'Lock'}
                  </Button>
                </HStack>

                <Badge colorScheme='blue' w='fit-content' variant='subtle'>
                  LOCK Fee : 2.5%
                </Badge>
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack spacing={3}>
                <Input
                  variant='outline'
                  placeholder='Enter Token Contract Address'
                  required
                  onChange={(e) => setLpContractAddress(e.target.value)}
                  value={lpContractAddress}
                  isDisabled={!isConnected}
                />
                <Input
                  variant='outline'
                  placeholder='Enter Token Amount'
                  onChange={(e) => setLpTokenAmount(e.target.value)}
                  value={lpTokenAmount}
                  isDisabled={!isConnected}
                />
                <HStack spacing={8}>
                  <Input
                    variant='outline'
                    placeholder='Enter Duration'
                    onChange={(e) => setLpDuration(e.target.value)}
                    value={lpDuration}
                    isDisabled={!isConnected}
                  />
                  <Select
                    variant='flushed'
                    colorScheme='blue'
                    onChange={(e) => setLpSelector(e.target.value)}
                    value={lpSelector}
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
                    isDisabled={!LPWrite || isLpApprovingLoading}
                    onClick={() => LPWrite?.()}
                  >
                    {isLpApprovingLoading ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    colorScheme='blue'
                    w='full'
                    isDisabled={!lpLockerWrite || isLpLockingLoading}
                    onClick={() => lpLockerWrite?.()}
                  >
                    {isLpLockingLoading ? 'Locking...' : 'Lock'}
                  </Button>
                </HStack>
                <Badge colorScheme='blue' w='fit-content' variant='subtle'>
                  LOCK Fee : 2.5%
                </Badge>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>
    </Grid>
  );
};

export default LiquidityLocker;
