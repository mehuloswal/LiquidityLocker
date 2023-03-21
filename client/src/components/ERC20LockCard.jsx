import React from 'react';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useDebounce } from '../utils/hooks/useDebounce';
import {
  Button,
  Card,
  CardBody,
  Text,
  Heading,
  HStack,
  VStack,
  Divider,
  useToast,
} from '@chakra-ui/react';

import ERC20Locker from '../contracts/ERC20Locker.json';
const ERC20LockerABI = ERC20Locker.abi;

const ERC20LockCard = ({ data }) => {
  const toast = useToast();
  const debouncedLockId = useDebounce(data.id, 500);
  const { config } = usePrepareContractWrite({
    address: process.env.DEVELOPMENT_ERC20LOCKER_CONTRACT_ADDRESS,
    abi: ERC20LockerABI,
    functionName: 'unlockTokens',
    args: [parseInt(debouncedLockId)],
    enabled: Boolean(debouncedLockId),
    structuralSharing: (prev, next) => (prev === next ? prev : next),
  });
  const { data: unlockTokensData, write } = useContractWrite(config);

  const { isLoading } = useWaitForTransaction({
    hash: unlockTokensData?.hash,
    onSuccess(data, error) {
      !toast.isActive(unlockTokensData.hash) &&
        toast({
          id: unlockTokensData.hash,
          title: 'Unlocked Successfully',
          description:
            'Your Tokens have been unlocked and are sent back to your address!',
          status: 'success',
          duration: '5000',
          isClosable: 'true',
          position: 'bottom-right',
        });
    },
  });

  return (
    <Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' w='full'>
      <CardBody>
        <Heading size='md' mb={2}>
          {data.tokenAddress}
        </Heading>
        <Divider />
        <HStack justify='space-between' mt={2}>
          <VStack spacing={1} align='flex-start'>
            <Text as='b' fontSize='sm' opacity={0.6} w='full'>
              Amount: {data.amount}
            </Text>
            <Text fontSize='sm' opacity={0.6} w='full'>
              Locked-Time: {data.startDate.toLocaleString()}
            </Text>
            <Text fontSize='sm' opacity={0.6} w='full'>
              Unlock-Time: {data.endDate.toLocaleString()}
            </Text>
          </VStack>
          <Button
            variant='solid'
            colorScheme='blue'
            isDisabled={!write || isLoading}
            onClick={() => write?.()}
          >
            {isLoading ? 'Unlocking...' : 'Unlock'}
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default ERC20LockCard;
