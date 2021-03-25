import React from "react";
import { Container } from "react-bootstrap";
import Register from "./pages/Register";
import "./App.scss";
import ApolloProvider from "./ApolloProvider";

function App() {
  return (
    <ApolloProvider>
      <Container>
        <Register />
      </Container>
    </ApolloProvider>
  );
}

export default App;
