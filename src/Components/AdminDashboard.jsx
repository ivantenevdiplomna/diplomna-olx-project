import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    Card,
    CardContent,
    IconButton,
    Tabs,
    Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, productsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats'),
                axios.get('http://localhost:5000/api/admin/users'),
                axios.get('http://localhost:5000/api/admin/products')
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data);
            setProducts(productsRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/products/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Users
                            </Typography>
                            <Typography variant="h5">
                                {stats?.totalUsers || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Products
                            </Typography>
                            <Typography variant="h5">
                                {stats?.totalProducts || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab icon={<PersonIcon />} label="Users" />
                    <Tab icon={<ShoppingBasketIcon />} label="Products" />
                </Tabs>
            </Box>

            {/* Users Table */}
            {activeTab === 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleDeleteUser(user._id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Products Table */}
            {activeTab === 1 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Seller</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>{product.title}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.seller?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleDeleteProduct(product._id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default AdminDashboard; 