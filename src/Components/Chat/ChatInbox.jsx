import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  useToast,
  Flex,
  Divider,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useAuth } from '../Context/AuthContext';
import Chat from './Chat';

const API_URL = 'http://localhost:5000/api';

const ChatInbox = ({ isOpen, onClose }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { isOpen: isChatOpen, onOpen: onChatOpen, onClose: onChatClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast({
            title: 'Please login',
            description: 'You need to be logged in to view chats',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
          onClose();
          return;
        }

        const response = await fetch(`${API_URL}/chats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }

        const data = await response.json();
        console.log('Current user:', user);
        console.log('Fetched chats:', data);
        setChats(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (isOpen) {
      fetchChats();
    }
  }, [isOpen, toast, onClose, user]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    onChatOpen();
  };

  const getOtherUser = (chat) => {
    // Get the current user ID from localStorage if not available in context
    const currentUserId = user?._id || JSON.parse(localStorage.getItem('user'))?.id;
    const buyerId = chat.buyer._id;
    const sellerId = chat.seller._id;

    console.log('Comparing IDs:', {
      currentUserId,
      buyerId,
      sellerId,
      isBuyer: currentUserId === buyerId
    });

    // If the current user is the buyer, return the seller
    if (currentUserId === buyerId) {
      return chat.seller;
    }
    // If the current user is the seller, return the buyer
    return chat.buyer;
  };

  const getOtherUserRole = (chat) => {
    if (chat.buyer._id === user?._id) {
      return 'Seller';
    }
    return 'Buyer';
  };

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return 'No messages yet';
    }
    const lastMessage = chat.messages[chat.messages.length - 1];
    const currentUserId = user?._id || JSON.parse(localStorage.getItem('user'))?.id;
    const isCurrentUser = lastMessage.sender._id === currentUserId;
    return `${isCurrentUser ? 'You' : getOtherUser(chat).name}: ${lastMessage.text}`;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Chats</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch" maxH="600px" overflowY="auto">
              {chats.length === 0 ? (
                <Text textAlign="center" py={4}>
                  No chats yet
                </Text>
              ) : (
                chats.map((chat) => {
                  const currentUserId = user?._id || JSON.parse(localStorage.getItem('user'))?.id;
                  const otherUser = getOtherUser(chat);
                  const isCurrentUserBuyer = chat.buyer._id === currentUserId;
                  
                  console.log('Chat display info:', {
                    chatId: chat._id,
                    otherUser: otherUser.name,
                    currentUserIsBuyer: isCurrentUserBuyer,
                    currentUserId
                  });

                  return (
                    <Box
                      key={chat._id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      cursor="pointer"
                      _hover={{ bg: 'gray.50' }}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <HStack spacing={4}>
                        <Avatar name={otherUser.name} size="md" />
                        <VStack align="start" flex="1">
                          <HStack justify="space-between" w="100%">
                            <Text fontWeight="bold">
                              {otherUser.name} ({isCurrentUserBuyer ? 'Seller' : 'Buyer'})
                            </Text>
                            <Badge colorScheme={chat.status === 'active' ? 'green' : 'gray'}>
                              {chat.status}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            {chat.product.title}
                          </Text>
                          <Text fontSize="sm" noOfLines={1}>
                            {getLastMessage(chat)}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  );
                })
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isChatOpen} onClose={onChatClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedChat && (
              <Chat
                productId={selectedChat.product._id}
                onClose={onChatClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatInbox; 