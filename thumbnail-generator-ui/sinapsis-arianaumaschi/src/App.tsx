import React from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import { useAuth0 } from '@auth0/auth0-react';

const App: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Generador de Thumbnails</h1>
        {isAuthenticated ? (
          <>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Logout
            </button>
            <ImageUploader />
          </>
        ) : (
          <button onClick={() => loginWithRedirect()}>Login</button>
        )}
      </header>
    </div>
  );
};

export default App;
