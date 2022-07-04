import React, { useEffect, useState } from "react";
import { Container, Form, Button, ButtonGroup, Image } from "react-bootstrap";
import { useFireContext } from "../Context";

export default function FriendList({ uid }) {
  const {
    getFriends,
    getProfilePicture,
    getDisplayName,
    addFriends,
    removeFriends,
  } = useFireContext();
  const [friendsView, setfriendsView] = useState(false);
  const [friendslist, setfriendslist] = useState([]);
  const [loading, setloading] = useState(false);

  async function handleFollow(e) {
    if (e.target.innerText == "Follow") {
      try {
        await addFriends(e.target.value);
        e.target.innerText = "Unfollow";
      } catch (err) {
        console.log(err);
      }
    } else if (e.target.innerText == "Unfollow") {
      try {
        removeFriends(e.target.value);
        e.target.innerText = "Follow";
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
        <Container className="mt-4">
          {friendslist.map((e) => {
            return (
              <Container className="d-flex justify-content-between border p-2 my-2 align-items-center">
                <Image className="avatar" src={e[1]} />
                <h3 className="mx-2">{e[0]}</h3>
                <ButtonGroup>
                  <Button className="mx-2" variant="outline-dark">
                    Message
                  </Button>
                  <Button
                    onClick={handleFollow}
                    className="mx-2"
                    value={e[2]}
                    variant="outline-dark"
                  >
                    Unfollow
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
