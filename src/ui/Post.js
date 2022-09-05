import React from "react";
import { Container, Image } from "react-bootstrap";

export default function Post({ displayName, profilePicture, time, content }) {
  return (
    <>
      <Container className="d-flex flex-column justify-content-around p-1 my-2 borderLine">
        <h6 className="text-center bg-light p-2">{time}</h6>
        <Container className="d-flex">
          <Container className="d-flex flex-column align-items-center p-2 w-25 border">
            <Image className="avatar" src={profilePicture} />
            <h5>{displayName}</h5>
          </Container>
          <Container className="d-flex align-items-center w-75">
            <p className="text-center text-justify border border-secondary p-2 bg-light w-100">
              {content}
            </p>
          </Container>
        </Container>
      </Container>
    </>
  );
}
