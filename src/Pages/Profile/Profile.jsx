import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  useToast,
  Badge,
  Button,
  Image,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useAuth } from '../../Components/Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Profile = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/products/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        setUserProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserProducts();
    }
  }, [isAuthenticated, user]);

  // Wait for auth to be checked before redirecting
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Don't show anything while redirecting
  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Text color="red.500">Error: {error}</Text>
          <Button onClick={() => window.location.reload()} colorScheme="blue">
            Retry
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <Box
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          boxShadow="sm"
        >
          <HStack spacing={8}>
            <Avatar size="2xl" name={user.name} />
            <VStack align="start" spacing={2}>
              <Heading size="lg">{user.name}</Heading>
              <Text color="gray.500">{user.email}</Text>
              {user.createdAt && (
                <Text color="gray.500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              )}
            </VStack>
          </HStack>
        </Box>

        {/* Tabs for different sections */}
        <Tabs variant="enclosed">
          <TabList>
            <Tab>My Products</Tab>
            <Tab>Favorites</Tab>
            <Tab>Settings</Tab>
          </TabList>

          <TabPanels>
            {/* My Products Tab */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">My Products</Heading>
                  <Button as={Link} to="/addproducts" colorScheme="blue">
                    Add New Product
                  </Button>
                </HStack>
                {userProducts.length === 0 ? (
                  <Text textAlign="center" py={4}>
                    You haven't listed any products yet
                  </Text>
                ) : (
                  <Grid
                    templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}
                    gap={6}
                  >
                    {userProducts.map((product) => (
                      <Box
                        key={product._id}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        _hover={{ shadow: 'md' }}
                      >
                        <Image
                          src={`http://localhost:5000/${product.image}`}
                          alt={product.title}
                          h="200px"
                          w="100%"
                          objectFit="cover"
                          fallbackSrc="https://via.placeholder.com/200"
                        />
                        <Box p={4}>
                          <Heading as="h3" size="md" mb={2}>
                            {product.title}
                          </Heading>
                          <Text color="gray.600" mb={2} noOfLines={2}>
                            {product.description}
                          </Text>
                          <HStack justify="space-between">
                            <Badge colorScheme="green" fontSize="md">
                              ₹{product.price}
                            </Badge>
                            <Badge colorScheme={product.status === 'available' ? 'blue' : 'gray'}>
                              {product.status}
                            </Badge>
                          </HStack>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                )}
              </VStack>
            </TabPanel>

            {/* Favorites Tab */}
            <TabPanel>
              <Text>Coming soon...</Text>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel>
              <Text>Coming soon...</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default Profile; 