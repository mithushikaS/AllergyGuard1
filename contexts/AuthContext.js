import React from 'react';

// Create context for authentication state
export const AuthContext = React.createContext({
  isAuthenticated: false,
  userRole: null,
  login: (role) => {},
  logout: () => {},
});

const MyComponent = () => {
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated ? (
        <Button title="Logout" onPress={logout} />
      ) : (
        <Button title="Login" onPress={login} />
      )}
    </>
  );
};

export default MyComponent;
