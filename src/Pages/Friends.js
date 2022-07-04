import React, { useRef, useState } from "react";
import { Container, Form, Button, ButtonGroup } from "react-bootstrap";
import { useFireContext } from "../Context";

export default function Friends() {
  const searchText = useRef();
  const [result, setresult] = useState([]);
  const [resultView, setresultView] = useState(false);
  const { getUserDetails, addFriends, removeFriends } = useFireContext();

  async function handleData(e) {
    e.preventDefault();
    // console.log(searchText.current.value.length);
    setresult([]);
    try {
      const data = await getUserDetails();
      // console.log(data);
      data.forEach((doc) => {
        // console.log(doc.id);
        if (
          !(searchText.current.value.length < 3) &&
          (doc.data().email.includes(searchText.current.value) ||
            doc.data().displayName.includes(searchText.current.value))
        ) {
          const r = [doc.id, doc.data()];
          setresult((result) => [...result, r]);
        } else {
        }
      });
      setresultView(true);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleFollow(e) {
    // console.log(e.target.value);
    if (e.target.innerText == "Follow") {
      try {
        await addFriends(e.target.value);
        e.target.innerText = "Unfollow";
      } catch (err) {
        console.log(err);
      }
    } else if (e.target.innerText == "Unfollow") {
      try {
        removeFriends(e.target.value);
        e.target.innerText = "Follow";
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <Container>
      <Form className="my-5">
        <Form.Label>Search</Form.Label>
        <Form.Control
          type="text"
          placeholder="Minimum 3 characters"
          ref={searchText}
        />
        <ButtonGroup className="my-2">
          <Button type="submit" onClick={handleData}>
            Search
          </Button>
        </ButtonGroup>
      </Form>
      {resultView ? (
        <>
          {result ? (
            <>
              <Container>
                {result.map((e) => {
                  return (
                    <>
                      <Container className="d-flex justify-content-between borderLine p-2 my-2">
                        <h3 className="mx-2">{e[1].displayName}</h3>
                        <Button
                          value={e[0]}
                          onClick={handleFollow}
                          variant="outline-dark"
                        >
                          Follow
                        </Button>
                      </Container>
                    </>
                  );
                })}
              </Container>
            </>
          ) : (
            ""
          )}
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}
