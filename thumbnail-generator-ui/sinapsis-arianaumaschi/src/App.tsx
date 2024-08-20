import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, AppBar, Toolbar, Typography, Container, Box, CircularProgress } from '@mui/material';

const App: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [loading, setLoading] = useState<boolean>(false); // Nuevo estado para gestionar el loading

  const handleLogin = async () => {
    setLoading(true); // Mostrar el loader al iniciar el proceso de login
    try {
      await loginWithRedirect(); // Iniciar el proceso de login
    } catch (error) {
      console.error('Error en el login:', error);
    } finally {
      setTimeout(() => {
        setLoading(false); // Ocultar el loader después de un retraso
      }, 2000);
    }
  };


  const handleLogout = async () => {
    setLoading(true); // Mostrar el loader al iniciar el proceso de login
    try {
      await logout({ logoutParams: { returnTo: window.location.origin } }); // Iniciar el proceso de login
    } catch (error) {
      console.error('Error en el logout:', error);
    } finally {
      setTimeout(() => {
        setLoading(false); // Ocultar el loader después de un retraso
      }, 2000);
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Generador de Thumbnails
          </Typography>
          {isAuthenticated ? (
            <Button
              color="inherit"
              onClick={handleLogout} // Usar la función handleLogin en lugar de loginWithRedirect directamente
            >
              Logout
            </Button>

          ) : (
            <Button
              color="inherit"
              onClick={handleLogin} // Usar la función handleLogin en lugar de loginWithRedirect directamente
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : isAuthenticated ? (
          <ImageUploader />
        ) : (
          <Typography variant="h5" textAlign="center">
            Desafio UI Ariana Umaschi - Sinapsis
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default App;
