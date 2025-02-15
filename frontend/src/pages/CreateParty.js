import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper,
  Stack
} from '@mui/material';

function CreateParty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    host_id: parseInt(localStorage.getItem('userId')),
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!userId || !token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (!formData.host_id) {
      setError('User ID not found. Please login again.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/food-party/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
        return;
      }
      
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.msg ||
                          'Failed to create food party';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Party
        </Typography>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Party Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              name="name"
            />

            <TextField
              label="Date"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
              name="date"
            />

            <TextField
              label="Location"
              fullWidth
              value={formData.location}
              onChange={handleChange}
              name="location"
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              name="description"
            />

            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit}
              fullWidth
            >
              Create Party
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default CreateParty; 