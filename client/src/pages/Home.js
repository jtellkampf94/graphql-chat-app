import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useQuery, useLazyQuery } from "@apollo/client";

import { useAuthDispatch } from "../context/auth";
import ProfileAvatarPNG from "../assets/images/profile-avatar.png";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      id
      username
      email
      createdAt
      token
      profilePictureUrl
      latestMessage {
        id
        content
        createdAt
        from {
          id
          username
        }
        to {
          id
          username
        }
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($id: ID!) {
    getMessages(id: $id) {
      id
      content
      createdAt
      from {
        id
        username
      }
      to {
        id
        username
      }
    }
  }
`;
const Home = ({ history }) => {
  const dispatch = useAuthDispatch();
  const [selectedUser, setSelectedUser] = useState(null);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const { loading, data, error } = useQuery(GET_USERS);

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData }
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      console.log(typeof selectedUser);
      getMessages({ variables: { id: selectedUser } });
    }
  }, [selectedUser]);

  if (messagesData) console.log(messagesData.getMessages);

  let usersMarkup;
  if (!data || loading) {
    usersMarkup = <p>Loading..</p>;
  } else if (data.getUsers.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map(user => (
      <div
        className="d-flex p-3"
        key={user.id}
        onClick={() => setSelectedUser(user.id)}
      >
        <Image
          className="mr-2"
          style={{ width: 50, height: 50, objectFit: "cover" }}
          src={
            user.profilePictureUrl ? user.profilePictureUrl : ProfileAvatarPNG
          }
          roundedCircle
        />
        <div>
          <p className="text-success">{user.username}</p>
          <p className="font-weight-light">
            {user.latestMessage
              ? user.latestMessage.content
              : "You are now connected"}
          </p>
        </div>
      </div>
    ));
  }

  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="bg-white">
        <Col xs={4} className="p-0 bg-secondary">
          {usersMarkup}
        </Col>
        <Col xs={8}>
          {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map(message => (
              <p key={message.id}>{message.content}</p>
            ))
          ) : (
            <p>You are now connected!</p>
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
