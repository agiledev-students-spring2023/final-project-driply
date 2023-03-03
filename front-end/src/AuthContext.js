import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  user: null
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState('');

  useEffect(() => {
    // const isAuth = async () => {
    //     const loggedInUser = localStorage.getItem("user"); //use cookie instead maybe
    //     if (loggedInUser) {
    //       setUser(loggedInUser);
    //     }
    // };

    // isAuth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser }}>
        {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;