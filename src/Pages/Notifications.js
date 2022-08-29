import React, { useState, useEffect } from "react";
import { Container, Image, ButtonGroup, Button } from "react-bootstrap";
import { useFireContext } from "../Context";

export default function Notifications() {
  const [personal, setpersonal] = useState(true);
  const [notifications, setnotifications] = useState([]);
  const [ready, setready] = useState(false);
  const [loading, setloading] = useState(false);
  const { getNotifications } = useFireContext();

  async function handleButton(e) {
    e.preventDefault();
    setpersonal(!personal);
    getData(personal);
  }
  async function getData(admin) {
    setloading(true);
    if (admin) {
      try {
        const data = await getNotifications(true);
        // console.log(data.data().alerts);
        setnotifications(data.data().alerts);
        // console.log(notifications);
        setloading(false);
        setready(true);
      } catch (err) {}
    } else {
      try {
        const data = await getNotifications(false);
        // console.log(data.data().alerts);
        setnotifications(data.data().alerts);
        // console.log(notifications);
        setloading(false);
        setready(true);
      } catch (err) {}
    }
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Container className="d-flex flex-column justify-content-around p-2 mt-2 borderLine bg-white">
        <ButtonGroup className="d-flex mb-3">
          <Button onClick={handleButton} disabled={personal}>Personal notifications</Button>
          <Button onClick={handleButton} variant="danger" disabled={!personal}>
            Admin notifications
          </Button>
        </ButtonGroup>
        {loading ? (
          <></>
        ) : (
          <>
            {notifications.map((n) => {
              return (
                <>
                  <ButtonGroup className="d-flex my-2">
                    <Button variant="secondary">{n}</Button>
                  </ButtonGroup>
                </>
              );
            })}
          </>
        )}
      </Container>
    </>
  );
}
