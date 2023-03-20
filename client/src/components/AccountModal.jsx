import React from 'react';

import {
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Tooltip,
  useClipboard,
  Divider,
} from '@chakra-ui/react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { truncateAddress } from '../utils/utils';
import { CopyIcon, SmallCloseIcon } from '@chakra-ui/icons';
const AccountModal = ({ isOpen, closeModal }) => {
  const { address, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data } = useBalance({
    address: address,
  });
  const { onCopy, hasCopied } = useClipboard(address);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        isCentered
        motionPreset='scale'
        size='xl'
      >
        <ModalOverlay />
        <ModalContent w='300px'>
          <ModalHeader>Account Details</ModalHeader>
          <ModalCloseButton
            _focus={{
              boxShadow: 'none',
            }}
          />
          <ModalBody paddingBottom='1.5rem'>
            <VStack>
              <Tooltip label={address} placement='auto' minW='max-content'>
                <Text as='b'>{` ${truncateAddress(address)}`}</Text>
              </Tooltip>
              {isConnected && (
                <>
                  <Text mt='0' as='b' fontSize='sm' color='blackAlpha.600'>
                    {data?.formatted} {data?.symbol}
                  </Text>
                  <HStack>
                    <Text fontSize='sm' color='blackAlpha.400'>
                      Connected to :
                    </Text>
                    <Text fontSize='sm' color='green.400'>
                      {connector.name}
                    </Text>
                  </HStack>
                </>
              )}
            </VStack>
            <Divider my='1rem' />
            <HStack>
              <Button onClick={onCopy} rightIcon={<CopyIcon />} w='full'>
                {hasCopied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                onClick={() => {
                  disconnect();
                  closeModal();
                }}
                rightIcon={<SmallCloseIcon />}
                w='full'
              >
                Disconnect
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AccountModal;
