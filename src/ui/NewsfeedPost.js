import React, { useState, useEffect } from "react";
import { Container, Image, Form } from "react-bootstrap";
import { useFireContext } from "../Context";

export default function NewsfeedPost({}) {
  const { getPosts, getProfilePicture, getDisplayName } = useFireContext();
  const [posts, setposts] = useState([]);
  const [postsView, setpostsView] = useState(false);

  async function handlePosts() {
    setposts([]);
    const data = await getPosts("public");
    data.forEach((post) => {
      // console.log(post.data());
      const text = post.data().text;
      const uid = post.data().uid;
      const dateTime = post.data().datePosted;
      getProfilePicture(uid).then((e) => {
        getDisplayName(uid).then((f) => {
          const post = [e, dateTime, text, f];
          setposts((posts) => [...posts, post]);
        });
      });
    });
  }
  useEffect(() => {
    handlePosts();
  }, []);
  return (
    <>
      <h3 className="text-center mb-5">Newsfeed</h3>
      {posts.map((e) => {
        return (
          <>
            <Container className="d-flex flex-column justify-content-around p-2 mt-2 border">
              <Container fluid>
                <h6 className="text-center bg-light p-2">{e[1]}</h6>
              </Container>
              <Container className="d-flex">
                <Container className="d-flex flex-column align-items-center p-2 w-25">
                  <Image className="avatar" src={e[0]} />
                  <h5>{e[3]}</h5>
                </Container>
                <Container className="d-flex align-items-center w-75">
                  <p className="text-center text-justify border p-2 bg-light w-100">
                    {e[2]}
                  </p>
                </Container>
              </Container>
            </Container>
          </>
        );
      })}
    </>
  );
}
