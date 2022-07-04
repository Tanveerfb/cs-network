import React, { useEffect, useState } from "react";
import { Container, Form, Button, ButtonGroup, Image } from "react-bootstrap";
import { useFireContext } from "../Context";

export default function FriendList({ uid }) {
  const { user, getFriends, getProfilePicture, getDisplayName } =
    useFireContext();
  const [friendsView, setfriendsView] = useState(false);
  const [friendslist, setfriendslist] = useState([]);
  const [friendsdata, setfriendsdata] = useState([]);

  async function handleFriends(e) {
    e.preventDefault();
    setfriendslist([]);
    const data = await getFriends(uid);
    setfriendsdata(data);
    console.log(friendsdata);
    friendsdata.forEach((fd) => {
      getProfilePicture(fd).then((pp) => {
        getDisplayName(fd).then((dn) => {
          setfriendslist((friendslist) => [...friendslist, [pp, dn, fd]]);
        });
      });
    });
    setfriendsView(!friendsView);
  }

  return (
    <>
      <Container className="d-grid gap-2">
        <Button variant="dark" onClick={handleFriends}>
          Friends
        </Button>
      </Container>
      {friendsView ? (
        <>
          <Container className="mt-4">
            {friendslist.map((e) => {
              return (
                <Container className="d-flex justify-content-between borderLine p-2 my-2">
                  <h3 className="mx-2">{e[1]}</h3>
                  <ButtonGroup>
                    <Button className="mx-2" variant="outline-dark">
                      Message
                    </Button>
                    <Button
                      className="mx-2"
                      value={e[2]}
                      variant="outline-dark"
                    >
                      UnFollow
                    </Button>
                  </ButtonGroup>
                </Container>
              );
            })}
          </Container>
        </>
      ) : (
        ""
      )}
    </>
  );
}
