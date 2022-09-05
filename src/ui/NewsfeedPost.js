import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { useFireContext } from "../Context";
import Post from "./Post";

export default function NewsfeedPost() {
  const { getPosts, getProfilePicture, getDisplayName, admin } =
    useFireContext();
  const [posts, setposts] = useState([]);
  const [postTime, setpostTime] = useState([]);
  const [postData, setpostData] = useState([]);
  const [AdminpostData, setAdminpostData] = useState([]);
  const [ready, setready] = useState(false);
  const [Posts, setPosts] = useState(true);

  async function getData() {
    setready(false);
    try {
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
        setpostData((postData) => [
          ...postData,
          [dn, dp, postTime[x], content],
        ]);
      }
      setready(true);
      setPosts(true);
    } catch (e) {
      console.log(e);
    }
  }

  async function getAdmindata() {
    setready(false);
    try {
      setAdminpostData([]);
      const data = await getPosts("admin");
      setposts(data.data().posts);
      setpostTime(data.data().time);
      for (let x = 0; x < posts.length; x++) {
        const uid = posts[x].substring(0, 28);
        const content = posts[x].substring(29);
        // console.log(uid);
        const dn = await getDisplayName(uid);
        // console.log(dn)
        const dp = await getProfilePicture(uid);
        setAdminpostData((postData) => [
          ...postData,
          [dn, dp, postTime[x], content],
        ]);
      }
      setready(true);
      setPosts(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleButton(e) {
    e.preventDefault();
    if (e.target.id == "showPosts") {
      getData();
    }
    if (e.target.id == "showAdminPosts") {
      getAdmindata();
    }
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <ButtonGroup className="d-flex">
        <Button id="showPosts" onClick={handleButton} variant={"secondary"}>
          Show posts
        </Button>
        {/* {admin ? (
          <>
            <Button
              id="showAdminPosts"
              onClick={handleButton}
              variant="secondary"
            >
              Show admin posts
            </Button>
          </>
        ) : (
          ""
        )} */}
      </ButtonGroup>
      {ready ? (
        <>
          {Posts ? (
            <>
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
            <>
              {AdminpostData.map((e) => {
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
          )}
        </>
      ) : (
        <Container>
          <h2 className="text-center p-3">Loading....</h2>
        </Container>
      )}
    </>
  );
}
