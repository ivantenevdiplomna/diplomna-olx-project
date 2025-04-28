import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Grid,
    Heading,
    Text,
    Image,
    Button,
    VStack,
    HStack,
    Select,
    useColorModeValue,
    Badge,
    Flex,
    Spinner,
    Center,
    useToast
} from '@chakra-ui/react';
import { categories } from '../../config/categories';

const API_URL = 'http://localhost:5000/api';

const Category = () => {
    const { category, subcategory } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory || '');
    const [sortBy, setSortBy] = useState('newest');
    const toast = useToast();

    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const bgColor = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const url = subcategory 
                    ? `${API_URL}/products/category/${category}?subcategory=${subcategory}`
                    : `${API_URL}/products/category/${category}`;
                
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load products. Please try again later.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchProducts();
        }
    }, [category, subcategory, toast]);

    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const filteredProducts = products.filter(product => {
        if (!selectedSubcategory) return true;
        return product.subcategory === selectedSubcategory;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    const categoryInfo = categories[category];

    return (
        <Box p={8}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl">
                    {categoryInfo?.name || 'Category'}
                </Heading>

                <HStack spacing={4}>
                    <Select
                        placeholder="Filter by subcategory"
                        value={selectedSubcategory}
                        onChange={handleSubcategoryChange}
                        maxW="300px"
                    >
                        {categoryInfo?.subcategories.map((sub) => (
                            <option key={sub.value} value={sub.value}>
                                {sub.label}
                            </option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Sort by"
                        value={sortBy}
                        onChange={handleSortChange}
                        maxW="200px"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </Select>
                </HStack>

                {sortedProducts.length === 0 ? (
                    <Center h="200px">
                        <Text fontSize="lg">No products found in this category</Text>
                    </Center>
                ) : (
                    <Grid
                        templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}
                        gap={6}
                    >
                        {sortedProducts.map((product) => (
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
                                />
                                <Box p={4}>
                                    <Heading as="h3" size="md" mb={2}>
                                        {product.title}
                                    </Heading>
                                    <Text color="gray.600" mb={2}>
                                        {product.description}
                                    </Text>
                                    <HStack justify="space-between">
                                        <Badge colorScheme="green" fontSize="md">
                                            ₹{product.price}
                                        </Badge>
                                        <Button 
                                            colorScheme="blue" 
                                            size="sm"
                                            as={Link}
                                            to={`/product/${product._id}`}
                                        >
                                            View Details
                                        </Button>
                                    </HStack>
                                </Box>
                            </Box>
                        ))}
                    </Grid>
                )}
            </VStack>
        </Box>
    );
};

export default Category; 