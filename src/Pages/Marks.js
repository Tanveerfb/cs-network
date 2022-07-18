import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  Form,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFireContext } from "../Context";

export default function Marks() {
  const navigate = useNavigate();
  const { getEventData, admin, addEventData } = useFireContext();
  const [data, setdata] = useState([]);
  const [ready, setready] = useState(false);
  const [loading, setloading] = useState(false);
  const [addMarksBar, setaddMarksBar] = useState(false);
  const [notification, setnotification] = useState(null);
  const eventName = useRef();
  const person1 = useRef();
  const person2 = useRef();
  const person3 = useRef();

  async function handleAddData(e) {
    e.preventDefault();
    try {
      setloading(true);
      const userArray = [
        person1.current.value,
        person2.current.value,
        person3.current.value,
      ];
      await addEventData(eventName.current.value, userArray);
      setloading(false);
      setnotification("Your data has been added.");
      setaddMarksBar(!addMarksBar);
      navigate(0);
    } catch (err) {
      console.log(err);
      setloading(false);
    }
  }
  async function getData() {
    try {
      setdata([]);
      const data = await getEventData();
      data.forEach((d) => {
        // console.log(d.id);
        setdata((data) => [...data, [d.id, d.data().participants]]);
      });
      setready(true);
    } catch (err) {
      console.log(err);
    }
  }
  function handleEventData() {
    setaddMarksBar(!addMarksBar);
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Container className="my-2">
        {admin ? (
          <>
            <ButtonGroup className="d-flex">
              <Button
                variant={addMarksBar ? "secondary" : "primary"}
                onClick={handleEventData}
              >
                Add event data
              </Button>
            </ButtonGroup>
            {addMarksBar ? (
              <Container>
                <h3 className="text-center mt-2">Add new marks</h3>
                <Form>
                  <Form.Group>
                    <Form.Label>New event name</Form.Label>
                    <Form.Control
                      placeholder="Event name"
                      type="text"
                      ref={eventName}
                    />
                  </Form.Group>
                  <Form.Group className="my-2">
                    <Form.Label>Enter names </Form.Label>
                    <Form.Control
                      placeholder="Person 1"
                      type="text"
                      ref={person1}
                    />
                    <Form.Control
                      placeholder="Person 2"
                      type="text"
                      ref={person2}
                    />
                    <Form.Control
                      placeholder="Person 3"
                      type="text"
                      ref={person3}
                    />
                  </Form.Group>
                  <ButtonGroup className="d-flex my-2">
                    <Button disabled={loading} onClick={handleAddData}>
                      Add event data
                    </Button>
                    <Button type="reset" variant="secondary">
                      Clear
                    </Button>
                  </ButtonGroup>
                </Form>
              </Container>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
        {ready ? (
          <>
            {data.map((d) => {
              return (
                <>
                  <h4 className="text-center mt-5 p-2 text-white bg-secondary">
                    {d[0]}
                  </h4>
                  <ListGroup
                    className="text-center p-3 border"
                    as={"ol"}
                    numbered
                  >
                    <ListGroupItem as={"li"} variant="warning">
                      {d[1][0]}
                    </ListGroupItem>
                    <ListGroupItem as={"li"} variant="primary">
                      {d[1][1]}
                    </ListGroupItem>
                    <ListGroupItem as={"li"} variant="secondary">
                      {d[1][2]}
                    </ListGroupItem>
                  </ListGroup>
                </>
              );
            })}
          </>
        ) : (
          <Container>
            <h2 className="text-center">There are no marks available</h2>
          </Container>
        )}
      </Container>
      )
    </>
  );
}
