import React, { useEffect, useState } from "react";
import { Container, Button, Table } from "react-bootstrap";
import { useFireContext } from "../Context";

export default function Marks() {
  const { user, getMarks } = useFireContext();
  const [data, setdata] = useState();
  const [marks, setmarks] = useState([]);
  // const [second, setsecond] = useState(null);
  // const [third, setthird] = useState(null);
  // const [four, setfour] = useState(null);
  // const [five, setfive] = useState(null);
  const [ready, setready] = useState(false);

  useEffect(() => {
    readMarks();
  }, []);
  function gradeMarks(mark) {
    if (mark < 50) {
      return "F";
    } else if (mark > 49 && mark < 60) {
      return "P";
    } else if (mark > 59 && mark < 70) {
      return "C";
    } else if (mark > 69 && mark < 80) {
      return "D";
    } else if (mark > 79) {
      return "HD";
    }
  }
  function readMarks() {
    getMarks(user.uid).then((arr) => {
      // console.log(marks.data().marks);
      arr.data().marks.forEach((mark) => {
        setmarks((m) => [...m, mark]);
      });
      setready(true);
    });
  }

  return (
    <>
      <Container className="my-2">
        <h4 className="text-center">Marks</h4>
      </Container>
      <Container className="my-2">
        {ready ? (
          <>
            <Table striped bordered hover className="my-2">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject name</th>
                  <th>Grade</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Applied Project - 1 </td>
                  <td>{ready ? gradeMarks(marks[0]) : "loading"}</td>
                  <td>{ready ? marks[0] : "loading"}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Applied Project - 2 </td>
                  <td>{gradeMarks(marks[1])}</td>
                  <td>{marks[1]}</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Object Oriented Programming</td>
                  <td>{gradeMarks(marks[2])}</td>
                  <td>{marks[2]}</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Communications and Technology</td>
                  <td>{gradeMarks(marks[3])}</td>
                  <td>{marks[3]}</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Developing Web Information Systems</td>
                  <td>{gradeMarks(marks[4])}</td>
                  <td>{marks[4]}</td>
                </tr>
              </tbody>
            </Table>
          </>
        ) : (
          <Table striped bordered hover className="my-2">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject name</th>
                <th>Grade</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Applied Project - 1 </td>
                <td>{"loading"}</td>
                <td>{"loading"}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Applied Project - 2 </td>
                <td>{"loading"}</td>
                <td>{"loading"}</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Object Oriented Programming</td>
                <td>{"loading"}</td>
                <td>{"loading"}</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Communications and Technology</td>
                <td>{"loading"}</td>
                <td>{"loading"}</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Developing Web Information Systems</td>
                <td>{"loading"}</td>
                <td>{"loading"}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </Container>
      )
    </>
  );
}
