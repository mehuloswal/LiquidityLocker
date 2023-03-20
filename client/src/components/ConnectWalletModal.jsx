import React from 'react';
import {
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { useConnect } from 'wagmi';
export default function ConnectWalletModal({ isOpen, closeModal }) {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        isCentered
        motionPreset='scale'
      >
        <ModalOverlay />
        <ModalContent w='300px'>
          <ModalHeader>Select Wallet</ModalHeader>
          <ModalCloseButton
            _focus={{
              boxShadow: 'none',
            }}
          />
          <ModalBody paddingBottom='1.5rem'>
            <VStack>
              {connectors.map((connector) => (
                <Button
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => {
                    connect({ connector });
                    closeModal();
                  }}
                  w='100%'
                  variant='outline'
                  colorScheme='blue'
                >
                  {connector.name}
                  {!connector.ready && ' (unsupported)'}
                  {isLoading &&
                    connector.id === pendingConnector?.id &&
                    ' (connecting)'}
                </Button>
              ))}
              {error && <div>{error.message}</div>}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
