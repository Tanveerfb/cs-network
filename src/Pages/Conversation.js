import React, { useEffect, useRef, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useFireContext } from "../Context";
export default function Conversation() {
  const Location = useLocation();
  const navigate = useNavigate();
  const docID = Location.state.docID;
  const { user, getMessages, getDisplayName, addReply } = useFireContext();
  const [ready, setready] = useState(false);
  const [messages, setmessages] = useState([]);
  const [chatRoomName, setchatRoomName] = useState("");
  const [receiver, setreceiver] = useState("");
  const [sender, setsender] = useState("");
  const message = useRef();

  async function getData() {
    const msgs = await getMessages(docID);
    setmessages(msgs.data().messages);
    setchatRoomName(msgs.data().name);
    const pUid = await getDisplayName(msgs.data().participants[0]);
    const p2Uid = await getDisplayName(msgs.data().participants[1]);
    if (pUid == user.uid) {
      setsender(pUid);
      setreceiver(p2Uid);
    } else {
      setsender(p2Uid);
      setreceiver(pUid);
    }
    setready(true);
  }
  async function handleReply(e) {
    e.preventDefault();
    await addReply(docID, message.current.value);
    navigate(0);
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {ready ? (
        <>
          <h2 className="text-center my-3">Chatroom of {chatRoomName}</h2>
          <Container
            fluid
            className="d-flex flex-column mt-3 justify-content-center align-items-center border"
          >
            {messages.map((m) => {
              console.log(sender.length);
              console.log(receiver.length);
              if (m.substring(0, receiver.length) == receiver) {
                return (
                  <>
                    <Container fluid className="w-75 justify-content-center">
                      <p className="p-2 m-2 bg-secondary text-white text-center text-justify rounded">
                        {m.substring(receiver.length + 1)}
                      </p>
                    </Container>
                  </>
                );
              } else {
                return (
                  <>
                    <Container fluid className="w-75 justify-content-center">
                      <p className="p-2 m-2 bg-primary text-white text-center text-justify rounded">
                        {m.substring(sender.length + 1)}
                      </p>
                    </Container>
                  </>
                );
              }
            })}
            <Container
              fluid
              className="d-flex p-2 my-2 w-75 justify-content-center"
            >
              <Form.Control type="text" className="w-75" ref={message} />
              <Button onClick={handleReply} className="">
                Send&nbsp;message
              </Button>
            </Container>
          </Container>
        </>
      ) : (
        <>
          <h2 className="text-center my-3">Loading...</h2>
        </>
      )}
    </>
  );
}
