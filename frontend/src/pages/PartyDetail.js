import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  CircularProgress,
  Grid,
  IconButton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function PartyDetail() {
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/welcome');
      return;
    }

    const fetchPartyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/food-party/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setParty(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Party not found' : 'Failed to fetch party details');
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/welcome');
        }
      }
    };

    fetchPartyDetails();
  }, [id, navigate]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Container>
      <Typography color="error" variant="h6">{error}</Typography>
    </Container>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ mb: 2 }}
          aria-label="go back"
        >
          <ArrowBackIcon />
        </IconButton>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {party.title}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {party.description}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography>
                  {new Date(party.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography>
                  {party.location}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography>
                  Host ID: {party.host_id}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default PartyDetail; 