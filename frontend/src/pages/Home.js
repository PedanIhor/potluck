import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, Box, Paper, Grid, Card, CardContent, CardActions } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

function Home() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/welcome');
      return;
    }

    const fetchParties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/food-party/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setParties(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch food parties');
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/welcome');
        }
      }
    };

    fetchParties();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Potluck
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Upcoming Parties
          </Typography>
          <Grid container spacing={3}>
            {parties.map((party) => (
              <Grid item xs={12} sm={6} md={4} key={party.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {party.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {party.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
                      <Typography variant="body2">
                        {new Date(party.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
                      <Typography variant="body2">
                        {party.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
                      <Typography variant="body2">
                        {party.host_id}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => navigate(`/party/${party.id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {parties.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">
                  No upcoming food parties found.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/create-party')}
          sx={{ mt: 2 }}
        >
          Create New Party
        </Button>
      </Box>
    </Container>
  );
}

export default Home; 