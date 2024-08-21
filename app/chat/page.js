'use client';
import { Box, Stack, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi, I'm an AI agent. How can I assist you today?`,
    }
  ]);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    setLoading(true);
    setMessage('');
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }])
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = result;
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      p={2}
      sx={{ backgroundColor: '#e8d6c5', fontFamily: 'Roboto, sans-serif' }}  // Light brown background
    >
      <Box
        mb={2}
        p={2}
        sx={{ backgroundColor: '#8f4d27', color: 'white', textAlign: 'center' }}
      >
        <Typography variant="h4">Welcome to Coffee AI</Typography>
        <Typography variant="h6">Ask your questions below</Typography>
      </Box>

      <Stack
        direction="column"
        width="100%"
        height="calc(100vh - 80px)"  // Adjust height to account for the header
        border="1px solid #bfae9e"  // Darker brown border
        borderRadius={8}
        boxShadow={3}
        p={2}
        spacing={3}
        sx={{ backgroundColor: '#f4e9e2', overflow: 'hidden' }}  // Slightly darker brown for the chat box
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          sx={{ maxHeight: '100%' }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
              p={1}
            >
              <Box
                bgcolor={msg.role === 'assistant' ? '#8f4d27' : '#a88c4a'}  // Different shades of brown
                color="white"
                borderRadius={16}
                p={2}
                maxWidth="75%"
                sx={{ wordWrap: 'break-word', boxShadow: 1 }}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
          {loading && (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress color="primary" />
            </Box>
          )}
          <div ref={chatEndRef} />
        </Stack>
        <Stack direction="row" spacing={2} width="100%" alignItems="center">
          <TextField
            label="Message"
            fullWidth
            variant="outlined"
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#bfae9e',  // Darker brown border
                },
                '&:hover fieldset': {
                  borderColor: '#8d6e63',  // Lighter brown on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8d6e63',  // Lighter brown on focus
                }
              },
              '& .MuiInputLabel-root': {
                color: '#8d6e63',  // Brown color for the label
                '&.Mui-focused': {
                  color: '#8d6e63',  // Brown color when label is focused
                }
              },
              '& .MuiInputBase-input': {
                color: '#8f4d27',  // Brown color for the text
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#8d6e63',  // Brown color for the placeholder text
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={loading}
            sx={{
              flexShrink: 0,  // Prevents button from shrinking
              px: 3,
              py: 1,
              textTransform: 'none',
              bgcolor: '#8f4d27',  // Brown color for the button
              borderColor: '#6d4c41',  // Darker brown border
              '&:hover': {
                bgcolor: '#6d4c41',  // Darker brown on hover
                borderColor: '#6d4c41',  // Match border color with hover
              }
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
