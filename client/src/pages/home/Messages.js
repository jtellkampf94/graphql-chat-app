import React, { Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

import { useMessageState, useMessageDispatch } from "../../context/message";
import Message from "./Message";

const SEND_MESSAGE = gql`
  mutation sendMessage($id: ID!, $content: String!) {
    sendMessage(id: $id, content: $content) {
      id
      from {
        id
        username
      }
      to {
        id
        username
      }
      content
      createdAt
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

const Messages = () => {
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  const [content, setContent] = useState("");

  const selectedUser = users ? users.find(u => u.selected === true) : null;
  const messages = selectedUser ? selectedUser.messages : null;

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData }
  ] = useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: data =>
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          id: selectedUser.id,
          message: data.sendMessage
        }
      }),
    onError: err => console.log(err)
  });

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

  const handleSubmit = e => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;

    setContent("");
    sendMessage({ variables: { id: selectedUser.id, content } });
  };

  let selectedChatMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className="info-text">Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p className="info-text">Loading..</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message.id}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = (
      <p className="info-text">
        You are now connected! send your first message!
      </p>
    );
  }

  return (
    <Col xs={10} md={8}>
      <div className="messages-box d-flex flex-column-reverse">
        {selectedChatMarkup}
      </div>
      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              className="message-input rounded-pill p-4 bg-secondary border-0"
              placeholder="Type a message..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <i
              className="fas fa-paper-plane fa-2x text-primary ml-2"
              onClick={handleSubmit}
              role="button"
            ></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
