import React, { useRef, useState } from "react";
import { Form, Container, Button } from "react-bootstrap";
import { useFireContext } from "../Context";
import { useNavigate } from "react-router-dom";
import Welcome from "../Components/Welcome";

export default function Signup() {
  const { signupusingEmailandPassword, updateDP } = useFireContext();
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const [loading, setloading] = useState(false);

  async function handleUser(e) {
    e.preventDefault();
    setloading(true);
    try {
      await signupusingEmailandPassword(
        email.current.value,
        password.current.value
      );
      await updateDP(
        "https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png"
      );
      navigate("/");
    } catch (err) {}
  }
  return (
    <Container className="bg-cover text-white p-5">
      <Welcome/>
      <h2 className="text-center">Signup</h2>
      <Form>
        <Form.Group className="my-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" ref={email} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" ref={password} />
        </Form.Group>
        <Button
          disabled={loading}
          onClick={handleUser}
          variant="primary"
          type="submit"
        >
          Sign up
        </Button>
        <Button
          disabled={loading}
          href="/"
          className="mx-2"
          variant="danger"
          type="submit"
        >
          Already have a account?
        </Button>
      </Form>
    </Container>
  );
}
