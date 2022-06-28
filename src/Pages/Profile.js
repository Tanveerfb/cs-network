import React, { useRef, useState } from "react";
import { Container, Form, Button, ButtonGroup, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFireContext } from "../Context";

export default function Profile() {
  const { user, updateDP, uploadDP, uploadProfileData } = useFireContext();
  const [displayName, setdisplayName] = useState(user.displayName || "");
  const [email, setemail] = useState(user.email);
  const [phoneNumber, setphoneNumber] = useState(user.phoneNumber || "");
  const [DPArea, setDPArea] = useState(false);
  const [loading, setloading] = useState(false);
  const name = useRef();
  const photoURL = useRef();
  const file = useRef();
  const phone = useRef();
  const navigate = useNavigate();

  function handleDP(e) {
    e.preventDefault();
    setDPArea(!DPArea);
  }
  async function handleDPUpload(e) {
    e.preventDefault();
    try {
      if (file.current.files[0] || photoURL.current.value) {
        if (file.current.files[0]) {
          console.log("file selected");
          setloading(true);
          await uploadDP(file.current.files[0]);
          navigate(0);
        } else {
          if (photoURL.current.value) {
            setloading(true);
            await updateDP(photoURL.current.value);
            navigate(0);
          }
        }
      }
    } catch (err) {
      console.log(err);
      setloading(false);
    }
  }

  async function handleProfileData(e) {
    e.preventDefault();
    try {
      setloading(true);
      await uploadProfileData(name.current.value);
      navigate(0);
    } catch (err) {
      console.log(err);
      setloading(false);
    }
  }

  return (
    <Container>
      <h4 className="text-center my-2">Profile Details </h4>
      <Container>
        <Form>
          {user.photoURL ? (
            <>
              <Container fluid className="d-flex justify-content-center">
                <Image
                  fluid
                  roundedCircle={true}
                  width="20%"
                  src={user.photoURL}
                  alt=""
                />
              </Container>
            </>
          ) : (
            <>
              <Form.Text>No profic picture available</Form.Text>
            </>
          )}
          {user.photoURL ? (
            <>
              <Button variant="dark" className="my-2" onClick={handleDP}>
                Update profile picture?
              </Button>
              {DPArea ? (
                <>
                  <Container className="my-3">
                    <Form.Control type="file" accept="image/*" ref={file} />
                    <Form.Label>Or</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="URL of image"
                      ref={photoURL}
                    />
                    <Button
                      disabled={loading}
                      onClick={handleDPUpload}
                      variant="primary"
                      className="my-2"
                    >
                      Update
                    </Button>
                  </Container>
                </>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
          <Form.Group className="mb-2">
            <Form.Label>Display name</Form.Label>
            <Form.Control
              type="text"
              defaultValue={displayName}
              ref={name}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Account email</Form.Label>
            <Form.Control
              readOnly
              type="text"
              defaultValue={email}
            ></Form.Control>
          </Form.Group>
          {/* <Form.Group className="mb-2">
            <Form.Label>Phone number</Form.Label>
            <Form.Control
              type="tel"
              defaultValue={phoneNumber}
              ref={phone}
            ></Form.Control>
          </Form.Group> */}

          <Form.Group className="mb-2">
            <ButtonGroup>
              <Button
                disabled={loading}
                onClick={handleProfileData}
                variant="primary"
              >
                Save
              </Button>
              <Button variant="secondary" type="reset" className="mx-2">
                Reset
              </Button>
            </ButtonGroup>
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
}
