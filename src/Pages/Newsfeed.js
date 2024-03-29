import React, { useRef, useState } from "react";
import { Container, Form, Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFireContext } from "../Context";
import NewsfeedPost from "../ui/NewsfeedPost";

export default function Newsfeed() {
  const { user, addPost } = useFireContext();
  const [loading, setloading] = useState(false);
  const text = useRef();
  const navigate = useNavigate();

  async function handlePost(e) {
    e.preventDefault();
    if (e.target.id == "postToPublic") {
      try {
        setloading(true);
        await addPost(user.uid, text.current.value);
        setloading(false);
        navigate(0);
      } catch (err) {
        console.log(err);
      }
    }
    if (e.target.id == "postToAdmin") {
      try {
        setloading(true);
        await addPost(user.uid, text.current.value, true);
        setloading(false);
        navigate(0);
      } catch (err) {
        console.log();
      }
    }
  }

  return (
    <Container className="my-5 bg-white">
      <Container className="p-2">
        <h2 className="my-2">What's on your mind?</h2>
        <Form.Control
          as={"textarea"}
          placeholder="Leave a post here"
          style={{ height: "100px" }}
          ref={text}
        ></Form.Control>
        <ButtonGroup className="d-flex my-2">
          <Button
            id="postToPublic"
            onClick={handlePost}
            disabled={loading}
            variant="primary"
          >
            Post to public
          </Button>
          {/* <Button
            disabled={loading}
            id="postToAdmin"
            onClick={handlePost}
            variant="danger"
          >
            Post to adminstrator
          </Button> */}
        </ButtonGroup>
      </Container>
      <Container>
        <NewsfeedPost />
      </Container>
    </Container>
  );
}
