import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

const Register = () => {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (cache, res) => console.log(res),
    onError: err => setErrors(err.graphQLErrors[0].extensions.errors)
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setVariables({ ...variables, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    registerUser({ variables });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label className={errors.email && "text-danger"}>
              Email address
            </Form.Label>
            <Form.Control
              isInvalid={errors.email}
              type="email"
              name="email"
              value={variables.email}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
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
          <Form.Group>
            <Form.Label className={errors.confirmPassword && "text-danger"}>
              Confirm password
            </Form.Label>
            <Form.Control
              isInvalid={errors.confirmPassword}
              type="password"
              name="confirmPassword"
              value={variables.confirmPassword}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading..." : "Register"}
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
