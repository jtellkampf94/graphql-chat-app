import React from "react";
import { Col, Image } from "react-bootstrap";
import ClassNames from "classnames";
import { gql, useQuery } from "@apollo/client";

import { useMessageDispatch, useMessageState } from "../../context/message";
import ProfileAvatarPNG from "../../assets/images/profile-avatar.png";

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

const Users = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users
    ? users.find(u => u.selected === true)
      ? users.find(u => u.selected === true).id
      : null
    : null;

  const { loading } = useQuery(GET_USERS, {
    onCompleted: data =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),
    onError: err => console.log(err)
  });

  let usersMarkup;
  if (!users || loading) {
    usersMarkup = <p>Loading..</p>;
  } else if (users.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (users.length > 0) {
    usersMarkup = users.map(user => {
      const selected = selectedUser === user.id;
      return (
        <div
          role="button"
          className={ClassNames("user-div d-flex p-3", {
            "bg-white": selected
          })}
          key={user.id}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.id })
          }
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
      );
    });
  }

  return (
    <Col xs={4} className="p-0 bg-secondary">
      {usersMarkup}
    </Col>
  );
};

export default Users;
