import React from 'react';
import {
  Flex,
  Spacer,
  Button,
  Box,
  Heading,
  useDisclosure,
  HStack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import ConnectWalletModal from './ConnectWalletModal';
import AccountModal from './AccountModal';
import { HamburgerIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { truncateAddress } from '../utils/utils';
import { useAccount } from 'wagmi';
import LocksDrawer from './LocksDrawer';

const Header = () => {
  const {
    isOpen: isConnectWalletOpen,
    onOpen: onConnectWalletOpen,
    onClose: onConnectWalletClose,
  } = useDisclosure();
  const {
    isOpen: isAccountOpen,
    onOpen: onAccountOpen,
    onClose: onAccountClose,
  } = useDisclosure();
  const {
    isOpen: isLocksDrawerOpen,
    onOpen: onLocksDrawerOpen,
    onClose: onLocksDrawerClose,
  } = useDisclosure();

  const { address, isConnected } = useAccount();

  return (
    <>
      <Flex minWidth='max-content' alignItems='center' p={3}>
        <Box p='2'>
          <Heading size='md' color='blue.800'>
            Token Locker
          </Heading>
        </Box>
        <Spacer />
        <HStack>
          {!isConnected ? (
            <Button colorScheme='blue' onClick={onConnectWalletOpen}>
              Connect Wallet
            </Button>
          ) : (
            <HStack>
              <Button
                colorScheme='blue'
                variant='outline'
                onClick={onAccountOpen}
                rightIcon={<CheckCircleIcon />}
              >
                <Tooltip label={address} placement='auto' minW='max-content'>
                  <Text>{` ${truncateAddress(address)}`}</Text>
                </Tooltip>
              </Button>
              <Button
                variant='ghost'
                rightIcon={<HamburgerIcon />}
                colorScheme='blue'
                onClick={onLocksDrawerOpen}
              >
                My Locks
              </Button>
            </HStack>
          )}
        </HStack>
      </Flex>
      <ConnectWalletModal
        isOpen={isConnectWalletOpen}
        closeModal={onConnectWalletClose}
      />
      <AccountModal isOpen={isAccountOpen} closeModal={onAccountClose} />
      <LocksDrawer isOpen={isLocksDrawerOpen} onClose={onLocksDrawerClose} />
    </>
  );
};

export default Header;
