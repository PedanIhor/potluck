import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';

function ParticipationForm() {
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: partyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishes = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/dishes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDishes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dishes');
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      setError('No authentication token found');
      return;
    }
    
    try {
      // Add the dish to the participation
      await axios.post(
        `http://localhost:8000/participation/${partyId}/dishes`,
        [selectedDish],  // Send array of dish IDs
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate(`/party/${partyId}`);
    } catch (err) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.detail || 'Failed to add dish to participation');
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(`/party/${partyId}`)}
          >
            Back to Party
          </Button>
        </Paper>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Participate with a Dish
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="dish-select-label">Select Dish</InputLabel>
              <Select
                labelId="dish-select-label"
                value={selectedDish}
                label="Select Dish"
                onChange={(e) => {
                  console.log('Dish selected:', e.target.value);  // Debug line 11
                  setSelectedDish(e.target.value);
                }}
                required
              >
                {dishes.map((dish) => (
                  <MenuItem key={dish.id} value={dish.id}>
                    {dish.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/party/${partyId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!selectedDish}
                onClick={() => console.log('Submit button clicked')}  // Debug line 12
              >
                Submit
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default ParticipationForm; 