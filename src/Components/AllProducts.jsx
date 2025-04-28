import React, { useEffect, useState } from 'react';
import { getPostsApiAllCategory } from '../Redux/Products/ProductApi';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Container, Box } from '@mui/material';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products...');
                const data = await getPostsApiAllCategory();
                console.log('Fetched products:', data);
                // Handle both array and paginated response formats
                const productsList = Array.isArray(data) ? data : data.products || [];
                setProducts(productsList);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>Loading products...</Typography>
            </Box>
        );
    }

    if (!products || products.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>No products found</Typography>
            </Box>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                All Products
            </Typography>
            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                            <Card sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 3
                                }
                            }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.image || 'https://via.placeholder.com/200'}
                                    alt={product.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="h2">
                                        {product.title}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        ${product.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.location}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AllProducts; 