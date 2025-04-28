import React, { useState, useEffect } from 'react';
import {
  Box,
  Image,
  Text,
  Heading,
  Button,
  VStack,
  HStack,
  Textarea,
  useToast,
  Badge,
  Divider,
  Avatar,
  Flex,
  Container,
  Stack,
  StackDivider,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { MdLocalShipping, MdLocationOn } from 'react-icons/md';
import { BsCalendarEvent } from 'react-icons/bs';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/Context/AuthContext';
import Chat from '../../Components/Chat/Chat';
import { useDisclosure } from '@chakra-ui/react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to comment',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: comment }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: 'Session expired',
            description: 'Please login again',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          navigate('/login');
          return;
        }
        throw new Error('Failed to add comment');
      }

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setComment('');
      toast({
        title: 'Comment added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

  if (loading) {
    return (
      <Box p={8}>
        <Text>Loading product details...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box p={8}>
        <Text>Product not found</Text>
      </Box>
    );
  }

  return (
    <Container maxW="7xl" margin="auto">
      <Flex className="viewParentDiv" direction={['column', 'column', 'row']}>
        <Box className="imageShowDiv">
          <img src={`http://localhost:5000/${product.image}`} alt="images" />
        </Box>
        <Box className="rightSection">
          <div className="productDetails">
            <p> {product.price} </p>
            <h1>{product.title}</h1>
            <span style={{ fontSize: 'smaller', color: 'grey', fontWeight: 'bold' }}>
              {product.post_uploaded}
            </span>
          </div>

          <div className="contactDetails">
            <p className="p-bold ">Seller details</p>
            <p>
              <strong style={{ color: 'grey' }}>Name :</strong> {product.title}
            </p>
            <p>
              <strong style={{ color: 'grey' }}>Phone :</strong> +9184678473
            </p>
          </div>
          <div className="contactDetails">
            <Text fontSize="30px" fontWeight="bolder" textAlign="center">
              {product.location}
            </Text>

            <Button 
              colorScheme="teal" 
              variant="outline" 
              w="90%" 
              marginTop="10px"
              onClick={onOpen}
            >
              Chat with seller
            </Button>
          </div>
        </Box>
      </Flex>
      <Stack spacing={{ base: 6, md: 10 }} columns={{ base: 1, lg: 2 }}>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction="column"
          divider={<StackDivider borderColor={borderColor} />}
        >
          <Flex
            columns={{ base: 1, lg: 2 }}
            justifyContent="space-between"
            direction={['column', 'column', 'row']}
          >
            <Box>
              <Box>
                <Badge colorScheme="yellow">{product._1IpS4}</Badge>
                <Heading>Overview</Heading>
                <Flex justify="space-evenly" alignItems="center">
                  <Flex justify="space-evenly" alignItems="center">
                    <MdLocationOn size="20px" />
                    <span style={{ margin: '10px' }}>{product.location}</span>
                  </Flex>
                  <Flex justify="space-evenly" alignItems="center">
                    <BsCalendarEvent size="20px" />
                    <span style={{ margin: '10px' }}>{product.post_uploaded}</span>
                  </Flex>
                </Flex>
              </Box>
              <div className="Description">
                <p className="p-bold">Product Description</p>
                <p>{product.description}</p>
              </div>
            </Box>

            <Box>
              <Card align="center" w={{ base: '18rem', lg: '23rem' }}>
                <CardHeader></CardHeader>
                <CardBody>
                  <Text fontSize="45px" fontWeight="bolder" textAlign="center">
                    {product.price}
                  </Text>
                  <Button bg="#002f34" color="white" w="20rem" marginTop="10px">
                    Make Offer
                  </Button>
                  <br />
                  <hr />
                  <Heading size="sm" marginTop="2rem">
                    Available at - {product.location}
                  </Heading>
                  <Button bg="#002f34" color="white" w="20rem" marginTop="10px">
                    Book test drive
                  </Button>
                  <br />
                  <Button colorScheme="teal" variant="outline" w="20rem" marginTop="10px">
                    Contact with seller
                  </Button>
                  <br />
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            </Box>
          </Flex>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center">
          <MdLocalShipping />
          <Text>2-3 business days delivery</Text>
        </Stack>
      </Stack>

      <Box>
        <Heading size="md" mb={4}>
          Comments
        </Heading>
        <VStack spacing={4} align="stretch">
          {product.comments?.map((comment) => (
            <Box key={comment._id} p={4} borderWidth="1px" borderRadius="md">
              <Flex align="center" mb={2}>
                <Avatar
                  name={comment.user?.name}
                  src={comment.user?.avatar}
                  size="sm"
                  mr={2}
                />
                <Text fontWeight="bold">{comment.user?.name}</Text>
              </Flex>
              <Text>{comment.text}</Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </Text>
            </Box>
          ))}
        </VStack>

        <Box mt={6}>
          <form onSubmit={handleCommentSubmit}>
            <VStack spacing={4}>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                size="lg"
              />
              <Button type="submit" colorScheme="blue" alignSelf="flex-end">
                Add Comment
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat with Seller</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Chat productId={id} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProductDetails;
