'use client';
import { Box, Stack, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleChatClick = () => {
    router.push('/chat');
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between" // Space between content and footer
      alignItems="center"
      sx={{ backgroundColor: '#fffbf5' }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1, // Allow container to grow
          textAlign: 'center'
        }}
      >
        <Stack
          direction="column"
          spacing={4}
          alignItems="center"
          textAlign="center"
        >
          <Typography variant="h1" sx={{ fontWeight: 'bold', color: '#8f4d27' }}>
            Meet Coffee AI
          </Typography>
          <Typography variant="h5" sx={{ color: '#3e2723' }}>
            Your personal coffee companion. Get the best coffee recommendations, brewing tips, and more!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              px: 4,
              py: 2,
              backgroundColor: '#8f4d27', // Default background color
              '&:hover': {
                backgroundColor: '#a1887f' // Light brown color on hover
              },
            }}
            onClick={handleChatClick}
          >
            Chat with Coffee AI
          </Button>
        </Stack>
      </Container>

      <Box
        component="footer"
        sx={{
          width: '100%',
          py: 2,
          backgroundColor: '#8f4d27',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          © 2024 Coffee AI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
