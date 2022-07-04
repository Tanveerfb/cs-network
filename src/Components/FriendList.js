import React, { useEffect, useState } from "react";
import { Container, Form, Button, ButtonGroup, Image } from "react-bootstrap";
import { useFireContext } from "../Context";

export default function FriendList({ uid }) {
  const { getFriends, getProfilePicture, getDisplayName } = useFireContext();
  const [friendsView, setfriendsView] = useState(false);
  const [friendslist, setfriendslist] = useState([]);
  const [friendsdata, setfriendsdata] = useState("");
  const [loading, setloading] = useState(false);

  function handleFriends(e) {
    e.preventDefault();
    setloading(true);
    try {
      setfriendslist([]);
      getFriends(uid).then((friend) => {
        // console.log(friend);
        friend.map((f) => {
          getDisplayName(f).then((dn) => {
            getProfilePicture(f).then((pp) => {
              setfriendslist((friendslist) => [...friendslist, [dn, pp, f]]);
            });
          });
        });
      });
      setfriendsView(!friendsView);
      setloading(false);
    } catch (err) {
      console.log(err);
      setloading(false);
    }
  }

  return (
    <>
      <Container className="d-grid gap-2 mt-3">
        <Button
          disabled={loading}
          id="getData"
          variant={loading ? "secondary" : "dark"}
          onClick={handleFriends}
        >
          Friends
        </Button>
      </Container>
      {friendsView ? (
        <Container className="mt-4">
          {friendslist.map((e) => {
            return (
              <Container className="d-flex justify-content-between borderLine p-2 my-2">
                <h3 className="mx-2">{e[0]}</h3>
                <ButtonGroup>
                  <Button className="mx-2" variant="outline-dark">
                    Message
                  </Button>
                  <Button className="mx-2" value={e[2]} variant="outline-dark">
                    UnFollow
                  </Button>
                </ButtonGroup>
              </Container>
            );
          })}
        </Container>
      ) : (
        ""
      )}
    </>
  );
}
