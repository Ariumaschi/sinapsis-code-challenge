import React from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, AppBar, Toolbar, Typography, Container } from '@mui/material';

const App: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

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
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {isAuthenticated ? (
          <ImageUploader />
        ) : (
          <Typography variant="h5" textAlign="center">
            Por favor, inicia sesión para usar la aplicación.
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default App;
