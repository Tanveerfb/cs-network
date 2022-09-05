import React, { useRef, useState } from "react";
import { Container, Form, Button, ButtonGroup, Image } from "react-bootstrap";
import { useFireContext } from "../Context";

export default function Search() {
  const searchText = useRef();
  const [result, setresult] = useState([]);
  const [resultView, setresultView] = useState(false);
  const { getUserDetails, addFriends, removeFriends } =
    useFireContext();

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
    if (e.target.innerText == "Add friend") {
      try {
        await addFriends(e.target.value);
        e.target.innerText = "Remove friend";
      } catch (err) {
        console.log(err);
      }
    } else if (e.target.innerText == "Remove friend") {
      try {
        removeFriends(e.target.value);
        e.target.innerText = "Add friend";
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <Container className=" bg-white">
      <Form className="my-5 p-2 bg-white">
        <Form.Label>Search</Form.Label>
        <Form.Control
          type="text"
          placeholder="Minimum 3 characters"
          ref={searchText}
          required
        />
        <Form.Text className="text-muted">
          Email address or display name
        </Form.Text>
        <ButtonGroup className="d-flex my-2">
          <Button type="submit" onClick={handleData}>
            Search
          </Button>
        </ButtonGroup>
      </Form>
      {resultView ? (
        <>
          {result ? (
            <>
              <Container className="p-2">
                {result.map((e) => {
                  return (
                    <>
                      <Container className="d-flex justify-content-between border p-2 my-2 align-items-center bg-white">
                        <Image className="avatar" src={e[1].profilePicture} />
                        <h3 className="mx-2">{e[1].displayName}</h3>
                        <ButtonGroup className="mx-2">
                          <Button
                            value={e[0]}
                            onClick={handleFollow}
                            variant="outline-dark"
                          >
                            Add friend
                          </Button>
                        </ButtonGroup>
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
