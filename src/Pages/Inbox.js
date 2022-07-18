import React, { useEffect, useRef, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useFireContext } from "../Context";
import { useNavigate } from "react-router-dom";
import FriendList from "../Components/FriendList";

export default function Inbox() {
  const { user, getInbox } = useFireContext();
  const [ready, setready] = useState(false);
  const [inboxView, setinboxView] = useState(false);
  const [messages, setmessages] = useState([]);
  const navigate = useNavigate();

  async function getData() {
    try {
      setmessages([]);
      getInbox(user).then((docs) => {
        docs.forEach((doc) => {
          console.log(doc.data());
          setmessages((messages) => [...messages, [doc.id, doc.data()]]);
          setready(true);
        });
      });
    } catch (err) {
      console.log(err);
    }
  }
  function handleMessageView(e) {
    e.preventDefault();
    navigate("/conversation", {
      state: {
        docID: e.target.value,
      },
    });
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {ready ? (
        <>
          <Container>
            <FriendList uid={user.uid} />
          </Container>
          <Container fluid className="my-2 p-2">
            <h3 className="text-center my-3">Total messages</h3>
            <Container fluid className="my-2">
              <ul>
                {messages[0] ? (
                  <>
                    {messages.map((m) => {
                      return (
                        <>
                          <li key={m[0]}>
                            <Container className="border my-2 p-3 d-flex justify-content-between">
                              <h2 className="m-2">{m[1].name}</h2>
                              <Button
                                value={m[0]}
                                onClick={handleMessageView}
                                variant="primary"
                                className="text-uppercase"
                              >
                                Go&nbsp;to&nbsp;conversation
                              </Button>
                            </Container>
                            {inboxView ? (
                              <>
                                <Container
                                  id={m[0]}
                                  className="border my-2  d-flex flex-column-reverse justify-content-between"
                                >
                                  <ul>
                                    <h4 className="text-center">
                                      Current messages
                                    </h4>
                                    {m[1].messages.map((msg) => {
                                      return (
                                        <>
                                          <li>
                                            <p className="text-center text-justify border border-secondary p-2 bg-light w-100">
                                              {msg}
                                            </p>
                                          </li>
                                        </>
                                      );
                                    })}
                                  </ul>
                                </Container>
                              </>
                            ) : (
                              ""
                            )}
                          </li>
                        </>
                      );
                    })}
                  </>
                ) : (
                  ""
                )}
              </ul>
            </Container>
          </Container>
        </>
      ) : (
        <Container>
          <h2 className="text-center mt-3">There are no messages</h2>
        </Container>
      )}
    </>
  );
}
