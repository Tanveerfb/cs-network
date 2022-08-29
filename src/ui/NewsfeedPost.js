import React, { useState, useEffect } from "react";
import { Container, Image, Form, ListGroup } from "react-bootstrap";
import { useFireContext } from "../Context";
import Post from "./Post";

export default function NewsfeedPost() {
  const { getPosts, getProfilePicture, getDisplayName } = useFireContext();
  const [posts, setposts] = useState([]);
  const [postTime, setpostTime] = useState([]);
  const [postData, setpostData] = useState([]);
  const [ready, setready] = useState(false);

  async function getData() {
    setposts([]);
    setpostData([]);
    const data = await getPosts("public");
    setposts(data.data().posts);
    setpostTime(data.data().time);
    for (let x = 0; x < posts.length; x++) {
      const uid = posts[x].substring(0, 28);
      const content = posts[x].substring(29);
      // console.log(uid);
      const dn = await getDisplayName(uid);
      // console.log(dn)
      const dp = await getProfilePicture(uid);
      setpostData((postData) => [...postData, [dn, dp, postTime[x], content]]);
    }
    setready(true);
  }
  useEffect(() => {
    getData()
  }, []);
  return (
    <>
      {ready ? (
        <>
          <h3 className="text-center mb-5">Newsfeed</h3>;
          {postData.map((e) => {
            return (
              <Post
                displayName={e[0]}
                profilePicture={e[1]}
                time={e[2]}
                content={e[3]}
              />
            );
          })}
        </>
      ) : (
        <Container>
          <h2 className="text-center">There are no posts here</h2>
        </Container>
      )}
    </>
  );
}
