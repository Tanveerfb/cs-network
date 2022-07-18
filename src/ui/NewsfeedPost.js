import React, { useState, useEffect } from "react";
import { Container, Image, Form, ListGroup } from "react-bootstrap";
import { useFireContext } from "../Context";
import Post from "./Post";

export default function NewsfeedPost({}) {
  const { getPosts, getProfilePicture, getDisplayName } = useFireContext();
  const [posts, setposts] = useState([]);
  const [postData, setpostData] = useState([]);
  const [ready, setready] = useState(false);

  async function handlePosts() {
    setposts([]);
    const data = await getPosts("public");
    data.forEach((p) => {
      const text = p.data().text;
      const uid = p.data().uid;
      const dateTime = p.data().datePosted;
      const post = [uid, dateTime, text];
      setposts((posts) => [...posts, post]);
    });
  }
  async function getPostData() {
    setpostData([]);
    posts.forEach((p) => {
      console.log(p);
      getDisplayName(p[0]).then((dp) => {
        getProfilePicture(p[0]).then((pp) => {
          setpostData((postData) => [...postData, [dp, pp, p[0], p[1], p[2]]]);
        });
      });
      setready(true);
      console.log(postData);
    });
  }
  useEffect(() => {
    handlePosts();
    getPostData();
  }, []);
  return (
    <>
      {ready ? (
        <>
          <h3 className="text-center mb-5">Newsfeed</h3>
          <ListGroup>
            {postData.map((e) => {
              return (
                <>
                  <ListGroup.Item>
                    <Post
                      displayName={e[0]}
                      profilePicture={e[1]}
                      time={e[5]}
                      content={e[4]}
                    />
                  </ListGroup.Item>
                </>
              );
            })}
          </ListGroup>
        </>
      ) : (
        <Container>
          <h2 className="text-center">There are no posts here</h2>
        </Container>
      )}
    </>
  );
}
