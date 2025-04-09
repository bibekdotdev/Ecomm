import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      className="d-flex flex-column justify-content-center align-items-center text-center"
      sx={{
        height: '100vh',
        bgcolor: '#f8f9fa',
        px: 2,
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 100 }} />
      <Typography variant="h2" className="mt-3 fw-bold text-danger">
        404
      </Typography>
      <Typography variant="h5" className="text-secondary mb-3">
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" className="mb-4 text-muted">
        The page you’re looking for doesn’t exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/Home')}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFoundPage;
