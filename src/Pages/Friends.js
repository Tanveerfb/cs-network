import React, { useRef, useState } from "react";
import {
  Container,
  Form,
  Button,
  ButtonGroup,
  Image,
  Table,
} from "react-bootstrap";
import { useFireContext } from "../Context";

export default function Friends() {
  const searchText = useRef();
  const [result, setresult] = useState([]);
  const [resultView, setresultView] = useState(false);
  const [marksTable, setmarksTable] = useState(false);
  const [loading, setloading] = useState(false);
  const [targetUserID, settargetUserID] = useState(null);
  var targetUserMarks = [];
  const firstMarks = useRef();
  const secondMarks = useRef();
  const thirdMarks = useRef();
  const fourthMarks = useRef();
  const fifthMarks = useRef();
  const { getUserDetails, addFriends, removeFriends, admin, updateMarks } =
    useFireContext();

  async function handleData(e) {
    e.preventDefault();
    // console.log(searchText.current.value.length);
    setmarksTable(false);
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
  function handleMarks(e) {
    e.preventDefault();
    settargetUserID(e.target.value);
    // console.log(targetUserID);
    setmarksTable(!marksTable);
  }
  async function handleSubmitMarks(e) {
    setloading(true);
    const sheet = [
      firstMarks.current.value,
      secondMarks.current.value,
      thirdMarks.current.value,
      fourthMarks.current.value,
      fifthMarks.current.value,
    ];
    targetUserMarks = sheet;
    console.log(targetUserMarks);
    try {
      await updateMarks(targetUserID, targetUserMarks);
      console.log("Done updating marks");
      setmarksTable(false);
      setloading(false);
    } catch (err) {
      console.log(err);
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
              <Container>
                {result.map((e) => {
                  return (
                    <>
                      <Container className="d-flex justify-content-between border p-2 my-2 align-items-center">
                        <Image className="avatar" src={e[1].profilePicture} />
                        <h3 className="mx-2">{e[1].displayName}</h3>
                        <ButtonGroup className="mx-2">
                          {admin ? (
                            <>
                              <Button
                                value={e[0]}
                                className="mx-2"
                                onClick={handleMarks}
                                variant="outline-danger"
                              >
                                Add marks
                              </Button>
                            </>
                          ) : (
                            ""
                          )}
                          <Button
                            value={e[0]}
                            onClick={handleFollow}
                            variant="outline-dark"
                          >
                            Add friend
                          </Button>
                        </ButtonGroup>
                      </Container>
                      {marksTable ? (
                        <>
                          <Table striped bordered hover size="sm">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Subject name</th>
                                <th>Marks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Applied Project - 1 </td>
                                <td>
                                  <Form.Control
                                    placeholder="Enter marks here"
                                    type={"number"}
                                    min="0"
                                    max={"100"}
                                    defaultValue="0"
                                    ref={firstMarks}
                                  ></Form.Control>
                                </td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>Applied Project - 2 </td>
                                <td>
                                  <Form.Control
                                    placeholder="Enter marks here"
                                    type={"number"}
                                    min="0"
                                    max={"100"}
                                    defaultValue="0"
                                    ref={secondMarks}
                                  ></Form.Control>
                                </td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>Object Oriented Programming</td>
                                <td>
                                  <Form.Control
                                    placeholder="Enter marks here"
                                    type={"number"}
                                    min="0"
                                    max={"100"}
                                    defaultValue="0"
                                    ref={thirdMarks}
                                  ></Form.Control>
                                </td>
                              </tr>
                              <tr>
                                <td>4</td>
                                <td>Communications and Technology</td>
                                <td>
                                  <Form.Control
                                    placeholder="Enter marks here"
                                    type={"number"}
                                    min="0"
                                    max={"100"}
                                    defaultValue="0"
                                    ref={fourthMarks}
                                  ></Form.Control>
                                </td>
                              </tr>
                              <tr>
                                <td>5</td>
                                <td>Developing Web Information Systems</td>
                                <td>
                                  <Form.Control
                                    placeholder="Enter marks here"
                                    type={"number"}
                                    min="0"
                                    max={"100"}
                                    defaultValue="0"
                                    ref={fifthMarks}
                                  ></Form.Control>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                          <Form>
                            <ButtonGroup className="d-flex">
                              <Button
                                type="submit"
                                disabled={loading}
                                onClick={handleSubmitMarks}
                              >
                                Update marks
                              </Button>
                            </ButtonGroup>
                          </Form>
                        </>
                      ) : (
                        ""
                      )}
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
