import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";

import { useMessageState, useMessageDispatch } from "../../context/message";

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

const Messages = () => {
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();

  const selectedUser = users ? users.find(u => u.selected === true) : null;
  const messages = selectedUser ? selectedUser.messages : null;

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData }
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { id: selectedUser.id } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: { id: selectedUser.id, messages: messagesData.getMessages }
      });
    }
  }, [messagesData]);

  let selectedChatMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p>Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p>Loading..</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map(message => (
      <p key={message.uuid}>{message.content}</p>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = <p>You are now connected! send your first message!</p>;
  }

  return <Col xs={8}>{selectedChatMarkup}</Col>;
};

export default Messages;
