import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      createdAt
      token
    }
  }
`;

const Login = ({ history }) => {
  const [variables, setVariables] = useState({
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: err => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted(data) {
      dispatch({ type: "LOGIN", payload: data.login });
      window.location.href = "/";
    }
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setVariables({ ...variables, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    loginUser({ variables });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label className={errors.username && "text-danger"}>
              Username
            </Form.Label>
            <Form.Control
              isInvalid={errors.username}
              type="text"
              name="username"
              value={variables.username}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.password && "text-danger"}>
              Password
            </Form.Label>
            <Form.Control
              isInvalid={errors.password}
              type="password"
              name="password"
              value={variables.password}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading..." : "Login"}
            </Button>
            <br />
            <small>
              Don't have an account? <Link to="/register">Register</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
