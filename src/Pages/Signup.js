import React, { useRef, useState } from "react";
import { Form, Container, Button } from "react-bootstrap";
import { useFireContext } from "../Context";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signupusingEmailandPassword } = useFireContext();
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
      navigate("/");
    } catch (err) {}
  }
  return (
    <Container>
      <h2 className="text-center">Signup</h2>
      <Form>
        <Form.Group className="my-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" ref={email} />
          <Form.Text className="text-muted">Required</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" ref={password} />
          <Form.Text className="text-muted">Required</Form.Text>
        </Form.Group>
        <Button
          disabled={loading}
          onClick={handleUser}
          variant="primary"
          type="submit"
        >
          Submit
        </Button>
        <Button
          disabled={loading}
          href="/"
          className="mx-2"
          variant="outline-dark"
          type="submit"
        >
          Already have a account?
        </Button>
      </Form>
    </Container>
  );
}
