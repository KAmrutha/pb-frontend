import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthenticationContexProvider } from "./ContextAPI/Authentication";
import { BudgetContextProvider } from "./ContextAPI/Budget";
import { SnackbarProvider, useSnackbar } from 'notistack'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SnackbarProvider   maxSnack={3}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right'}}>
  <ChakraProvider>
    <BrowserRouter>
      <AuthenticationContexProvider>
        <BudgetContextProvider>
          <App />
        </BudgetContextProvider>
      </AuthenticationContexProvider>
    </BrowserRouter>
  </ChakraProvider></SnackbarProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
