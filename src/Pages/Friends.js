import React from "react";
import { Container } from "react-bootstrap";
import FriendList from "../Components/FriendList";
import { useFireContext } from "../Context";

export default function Friends() {
  const { user } = useFireContext();
  return (
    <Container className="bg-white">
      <FriendList uid={user.uid} />
    </Container>
  );
}
