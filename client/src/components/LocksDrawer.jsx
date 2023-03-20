import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
} from '@chakra-ui/react';
const LocksDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        colorScheme='blue'
        size='lg'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>My Locks</DrawerHeader>

          <DrawerBody></DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LocksDrawer;
