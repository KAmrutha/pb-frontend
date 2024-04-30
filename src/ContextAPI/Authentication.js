// AuthContext.js
import React, { createContext, useContext, useState } from "react";
import Axios from "./Request";
import { useSnackbar ,SnackbarProvider} from "notistack";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthenticationContexProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    refreshToken: "",
    authToken: "",
    email: "",
  });

  const isLoggedin = () => {
    return !!localStorage.getItem("TOKEN") || !!user.authToken;
  };

  const login = async (userData) => {
    try {
      const response = await Axios.post("/auth/login", {
        email: userData.email,
        password: userData.password,
      });

      const { token, refreshToken } = response.data;
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; 

      user.authToken = token;
      user.refreshToken = refreshToken;
      localStorage.setItem("TOKEN", token); 
      localStorage.setItem("REFRESH_TOKEN", refreshToken); 

      setUser(userData);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Invalid Mail or Id", { variant: "error" });
    }
  };

  const logout = () => {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    setUser({
      username: "",
      refreshToken: "",
      authToken: "",
      email: "",
    });

    navigate("/signin");
  };

  const signup = async (userData) => {
    try {
      const response = await Axios.post("/auth/register", {
        name: userData.username,
        password: userData.password,
        email: userData.email,
      });
      const { token, refreshToken } = response.data;
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; 

      user.authToken = token;
      user.refreshToken = refreshToken;
      localStorage.setItem("TOKEN", token); 
      localStorage.setItem("REFRESH_TOKEN", refreshToken); 

      setUser(user);
      setUser(user);
      setUser(user);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Can't signup", { variant: "error" });
    }
  };

  const refreshToken = async () => {
    try {
      const response = await Axios.post("/auth/getAccessToken", {
        refreshToken: localStorage.getItem("REFRESH_TOKEN") || user.refreshToken,
      });
      const { token } = response.data;
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; 
      user.authToken = token;
     // user.refreshToken = refreshToken;

      enqueueSnackbar("Refreshed token", { variant: "success" });
      setUser(user);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to refresh token", { variant: "error" });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signup, refreshToken, isLoggedin }}
    > 
      {children}
    </AuthContext.Provider>
  );
};
