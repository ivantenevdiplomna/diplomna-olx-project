import React from 'react';
import { Box, Image, Text, VStack, Button, Badge, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/Context/AuthContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const handleBuyClick = () => {
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to buy products',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    // TODO: Implement buy functionality
    toast({
      title: 'Feature coming soon',
      description: 'Buy functionality will be implemented soon',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      cursor="pointer"
      _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <Image
        src={`http://localhost:5000/${product.image}`}
        alt={product.title}
        objectFit="cover"
        height="200px"
        width="100%"
        borderRadius="md"
      />
      <VStack align="start" spacing={2} mt={4}>
        <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
          {product.title}
        </Text>
        <Text color="gray.600" noOfLines={2}>
          {product.description}
        </Text>
        <Text fontWeight="bold" color="blue.500">
          ${product.price}
        </Text>
        <Badge colorScheme={product.status === 'available' ? 'green' : 'red'}>
          {product.status}
        </Badge>
        <Button
          colorScheme="blue"
          size="sm"
          width="full"
          onClick={(e) => {
            e.stopPropagation();
            handleBuyClick();
          }}
        >
          Buy Now
        </Button>
      </VStack>
    </Box>
  );
};

export default ProductCard; 