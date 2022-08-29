import React, { useEffect, useRef, useState } from "react";
import { Container, Form, Button, ButtonGroup, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFireContext } from "../Context";

export default function FriendList({ uid }) {
  const {
    getFriends,
    getProfilePicture,
    getDisplayName,
    addFriends,
    removeFriends,
    sendMessage,
  } = useFireContext();
  const navigate = useNavigate();
  const [friendsView, setfriendsView] = useState(false);
  const [friendslist, setfriendslist] = useState([]);
  const [sendMessageView, setsendMessageView] = useState(false);
  const [senderID, setsenderID] = useState(null);
  const outgoingMessage = useRef();
  const [loading, setloading] = useState(false);

  async function handleFollow(e) {
    if (e.target.innerText == "Add friend") {
      try {
        await addFriends(e.target.value);
        e.target.innerText = "Remove friend";
      } catch (err) {
        console.log(err);
      }
    } else if (e.target.innerText == "Remove friend") {
      try {
        removeFriends(e.target.value);
        e.target.innerText = "Add friend";
      } catch (err) {
        console.log(err);
      }
    }
  }
  function handleFriends(e) {
    e.preventDefault();
    setloading(true);
    try {
      setfriendslist([]);
      getFriends(uid).then((friend) => {
        friend.map((f) => {
          getDisplayName(f).then((dn) => {
            getProfilePicture(f).then((pp) => {
              setfriendslist((friendslist) => [...friendslist, [dn, pp, f]]);
            });
          });
        });
      });
      setfriendsView(!friendsView);
      setsendMessageView(false);
      setloading(false);
    } catch (err) {
      console.log(err);
      setloading(false);
    }
  }
  function messengerView(e) {
    e.preventDefault();
    setsenderID(e.target.value);
    setsendMessageView(!sendMessageView);
  }
  async function handleSendMessage(e) {
    e.preventDefault();
    setloading(true);
    try {
      await sendMessage(senderID, outgoingMessage.current.value, uid);
      setsendMessageView(!sendMessageView);
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Container className="d-grid mt-3">
        <Button
          className="d-flex justify-content-between align-items-center text-center"
          disabled={loading}
          id="getData"
          variant={friendsView ? "secondary" : "dark"}
          onClick={handleFriends}
        >
          Friends
          <Button variant={friendsView ? "light" : "primary"}>
            {!friendsView ? "Click to show" : "Click to Hide"}
          </Button>
        </Button>
      </Container>
      {friendsView ? (
        <>
          {friendslist.map((e) => {
            return (
              <Container className="d-flex justify-content-between border my-2 p-2 align-items-center bg-white">
                <Image className="avatar" src={e[1]} />
                <h3 className="mx-2">{e[0]}</h3>
                <ButtonGroup className="d-flex justify-content-center p-2 flex-wrap">
                  <Button
                    value={e[2]}
                    onClick={messengerView}
                    className="m-2"
                    variant="outline-dark"
                  >
                    Message
                  </Button>
                  <Button
                    onClick={handleFollow}
                    className="m-2"
                    value={e[2]}
                    variant="outline-dark"
                  >
                    Remove friend
                  </Button>
                </ButtonGroup>
              </Container>
            );
          })}
          {sendMessageView ? (
            <>
              <Container>
                <Form>
                  <Form.Group className="my-2">
                    <Form.Label>Send message</Form.Label>
                    <Form.Control
                      type="textarea"
                      ref={outgoingMessage}
                    ></Form.Control>
                  </Form.Group>
                  <ButtonGroup className="d-flex my-2">
                    <Button onClick={handleSendMessage}>Send message</Button>
                  </ButtonGroup>
                </Form>
              </Container>
            </>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}
