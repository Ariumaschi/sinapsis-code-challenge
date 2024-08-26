import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, AppBar, Toolbar, Typography, Container, Box, CircularProgress, List, ListItem } from '@mui/material';

const listItemStyles = {
  py: 1,
  borderRadius: 1,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#f7e6b4',
    cursor: 'pointer',
    color: 'black',

  },
};
const App: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error('Error en el login:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };


  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      console.error('Error en el logout:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="App">
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#FFC80F',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'black' }}>
            Generador de Thumbnails
          </Typography>
          {isAuthenticated ? (
            <Button
              sx={{
                color: 'black',
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: '#e0e0e0',
                }
              }} onClick={handleLogout} >
              Logout
            </Button>

          ) : (

            <Box>
              <Button

                onClick={() => loginWithRedirect({
                  authorizationParams: {
                    screen_hint: 'signup'
                  }
                })}

                sx={{
                  color: 'black',
                  bgcolor: 'transparent',
                  '&:hover': {
                    bgcolor: '#e0e0e0',
                  }
                }}
              >
                Registrarse
              </Button>

              <Button
                sx={{
                  color: 'black',
                  bgcolor: 'transparent',
                  '&:hover': {
                    bgcolor: '#e0e0e0',
                  }
                }}
                onClick={handleLogin}
              >
                Iniciar sesión
              </Button>
            </Box>
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
          <Box>

            <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              Desafío UI Ariana Umaschi - Sinapsis
            </Typography>

            <Container maxWidth="md">
              <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
                Funcionalidades de la Página Web:
              </Typography>

              <List sx={{ color: 'white', fontSize: '1.1rem', lineHeight: 1.6 }}>
                <ListItem sx={listItemStyles}>1. Carga de archivos mediante HTTP</ListItem>
                <ListItem sx={listItemStyles}>2. Simulación de endpoints requeridos</ListItem>
                <ListItem sx={listItemStyles}>3. Vista previa de la imagen a procesar</ListItem>
                <ListItem sx={listItemStyles}>4. Generación y visualización de URLs de miniaturas</ListItem>
                <ListItem sx={listItemStyles}>5. Funcionalidades del MVP (50 puntos)</ListItem>
                <ListItem sx={listItemStyles}>6. Funcionalidad de arrastrar y soltar (5 puntos)</ListItem>
                <ListItem sx={listItemStyles}>7. Área de recorte y redimensionamiento (5 puntos)</ListItem>
                <ListItem sx={listItemStyles}>8. Despliegue en un servicio en la nube: Vercel (10 puntos)</ListItem>
                <ListItem sx={listItemStyles}>9. Tech Stack: React y TypeScript</ListItem>
                <ListItem sx={listItemStyles}>10. Framework de diseño: Material UI</ListItem>
                <ListItem sx={listItemStyles}>11. Gestión de estado global: TanStack Query</ListItem>
                <ListItem sx={listItemStyles}>12. Lógica de autenticación: Auth0</ListItem>
              </List>
            </Container>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default App;
