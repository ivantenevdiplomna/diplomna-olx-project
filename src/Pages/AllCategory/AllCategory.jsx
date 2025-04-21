import React, { useState, useEffect } from 'react';
import { Box, Grid, Heading, Text, Select, VStack, HStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../Components/ProductCard/ProductCard';

const AllCategory = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('-createdAt');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:5000/api/products/category/${category}?sort=${sortBy}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, sortBy]);

    if (loading) {
        return (
            <Box p={8}>
                <Text>Loading products...</Text>
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

    return (
        <Box p={8}>
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                    <Heading size="lg" textTransform="capitalize">
                        {category}
                    </Heading>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        width="200px"
                    >
                        <option value="-createdAt">Newest First</option>
                        <option value="createdAt">Oldest First</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                    </Select>
                </HStack>

                {products.length === 0 ? (
                    <Text>No products found in this category.</Text>
                ) : (
                    <Grid
                        templateColumns={{
                            base: '1fr',
                            md: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                            xl: 'repeat(4, 1fr)',
                        }}
                        gap={6}
                    >
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </Grid>
                )}
            </VStack>
        </Box>
    );
};

export default AllCategory; 