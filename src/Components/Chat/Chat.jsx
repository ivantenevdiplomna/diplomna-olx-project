import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  useToast,
  Avatar,
  Flex,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { useAuth } from '../Context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const Chat = ({ productId, onClose }) => {
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast({
            title: 'Please login',
            description: 'You need to be logged in to chat',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
          onClose();
          return;
        }

        // First try to find existing chat
        const response = await fetch(`${API_URL}/chats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }

        const chats = await response.json();
        const existingChat = chats.find(c => c.product._id === productId);

        if (existingChat) {
          setChat(existingChat);
          setLoading(false);
          return;
        }

        // If no existing chat, create new one (only if user is not the seller)
        const productResponse = await fetch(`${API_URL}/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product');
        }

        const product = await productResponse.json();
        if (product.seller._id === user?._id) {
          // If user is the seller, they can't create a new chat
          toast({
            title: 'Error',
            description: 'Cannot start chat with yourself',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          onClose();
          return;
        }

        // Create new chat
        const createResponse = await fetch(`${API_URL}/chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create chat');
        }

        const newChat = await createResponse.json();
        setChat(newChat);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [productId, toast, onClose, user]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chats/${chat._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const updatedChat = await response.json();
      setChat(updatedChat);
      setMessage('');
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

  const getOtherUser = (chat) => {
    const currentUserId = user?._id || JSON.parse(localStorage.getItem('user'))?.id;
    // If the current user is the buyer, return the seller
    if (chat.buyer._id === currentUserId) {
      return chat.seller;
    }
    // If the current user is the seller, return the buyer
    return chat.buyer;
  };

  if (loading) {
    return (
      <Box p={4}>
        <Text>Loading chat...</Text>
      </Box>
    );
  }

  if (!chat) {
    return (
      <Box p={4}>
        <Text>Failed to load chat</Text>
      </Box>
    );
  }

  const otherUser = getOtherUser(chat);
  const isCurrentUserBuyer = chat.buyer._id === (user?._id || JSON.parse(localStorage.getItem('user'))?.id);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      w="100%"
      h="600px"
      display="flex"
      flexDirection="column"
    >
      <Box p={4} borderBottomWidth="1px">
        <Flex justify="space-between" align="center">
          <HStack>
            <Avatar name={otherUser.name} size="sm" />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">{otherUser.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {chat.product.title}
              </Text>
            </VStack>
          </HStack>
          <Badge colorScheme={chat.status === 'active' ? 'green' : 'gray'}>
            {chat.status}
          </Badge>
        </Flex>
      </Box>

      <VStack
        flex="1"
        overflowY="auto"
        p={4}
        spacing={4}
        align="stretch"
      >
        {chat.messages.map((msg) => {
          const isCurrentUserMessage = isCurrentUserBuyer ? msg.sender._id === chat.buyer._id : msg.sender._id === chat.seller._id;
          return (
            <Box
              key={msg._id}
              alignSelf={isCurrentUserMessage ? 'flex-end' : 'flex-start'}
              maxW="70%"
            >
              <VStack align={isCurrentUserMessage ? 'flex-end' : 'flex-start'} spacing={1}>
                <Text fontSize="xs" color="gray.500">
                  {isCurrentUserMessage ? 'You' : msg.sender.name}
                </Text>
                <HStack
                  spacing={2}
                  bg={isCurrentUserMessage ? 'blue.500' : 'gray.100'}
                  color={isCurrentUserMessage ? 'white' : 'black'}
                  p={3}
                  borderRadius="lg"
                >
                  <Text>{msg.text}</Text>
                </HStack>
                <Text 
                  fontSize="xs" 
                  color="gray.500"
                >
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </Text>
              </VStack>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </VStack>

      <Box p={4} borderTopWidth="1px">
        <form onSubmit={handleSendMessage}>
          <HStack>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              size="lg"
            />
            <Button type="submit" colorScheme="blue" size="lg">
              Send
            </Button>
          </HStack>
        </form>
      </Box>
    </Box>
  );
};

export default Chat; 