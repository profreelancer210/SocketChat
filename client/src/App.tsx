import React from "react";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { Chats, Login } from "./pages";
import ProtectedLoginRoute from "./components/ProtectedRoutes/ProtectedLoginRoute";
import ProtectedUserRoute from "./components/ProtectedRoutes/ProtectedUserRoute";

const App = () => {
  return (
    <Wrapper>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedUserRoute>
              <Chats />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedLoginRoute>
              <Login />
            </ProtectedLoginRoute>
          }
        />
      </Routes>
    </Wrapper>
  );
};

export default App;

const Wrapper = styled.div`
  height: 20vh;
  background-color: var(--app-primary-clr);
`;
