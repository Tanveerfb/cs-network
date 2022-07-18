import React, { useRef, useState } from "react";
import { Form, Container, Button, ButtonGroup } from "react-bootstrap";
import { useFireContext } from "../Context";
import { useNavigate } from "react-router-dom";
import Welcome from "../Components/Welcome";

export default function Login() {
  const { loginusingEmailandPassword, sendPasswordReset } = useFireContext();
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const [loading, setloading] = useState(false);
  const [forgotPass, setforgotPass] = useState(false);
  const [notification, setnotification] = useState(null);
  const resetEmail = useRef();

  async function handleUser(e) {
    e.preventDefault();
    setloading(true);
    try {
      await loginusingEmailandPassword(
        email.current.value,
        password.current.value
      );
      navigate("/");
    } catch (err) {
      setnotification("There is a problem with logging in.");
    }
  }
  async function handlePasswordReset(e) {
    e.preventDefault();
    try {
      await sendPasswordReset(resetEmail.current.value);
      setnotification("Password reset email sent!");
      setforgotPass(false);
    } catch (err) {
      setnotification(
        "There is a problem with sending the password reset mail."
      );
    }
  }

  return (
    <Container className="bg-cover text-white p-5">
      <Welcome />
      {notification ? (
        <Container>
          <p className="p-2 bg-info text-center text-dark">{notification}</p>
        </Container>
      ) : (
        ""
      )}
      <h2 className="text-center">Login</h2>
      <Form>
        <Form.Group className="my-3" controlId="formBasicEmail">
          <Form.Label>Student/Staff email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" ref={email} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" ref={password} />
        </Form.Group>
        <ButtonGroup className="d-flex">
          <Button
            disabled={loading}
            onClick={handleUser}
            variant="primary"
            type="submit"
          >
            Login
          </Button>
          <Button
            disabled={loading}
            href="signup"
            className="mx-2"
            variant="danger"
            type="submit"
          >
            Create a account?
          </Button>
        </ButtonGroup>
        <ButtonGroup className="my-2 d-flex">
          <Button onClick={() => setforgotPass(!forgotPass)} variant="success">
            Forgot password?
          </Button>
        </ButtonGroup>
        {forgotPass ? (
          <Container className="mt-2 p-3 border">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={resetEmail} />
            <ButtonGroup className="d-flex mt-2">
              <Button onClick={handlePasswordReset} variant="secondary">
                Send password reset link
              </Button>
            </ButtonGroup>
          </Container>
        ) : (
          ""
        )}
      </Form>
    </Container>
  );
}
