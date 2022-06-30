import React, { useState, useEffect } from "react";
import { Container, Image, Form } from "react-bootstrap";
import { useFireContext } from "../Context";

export default function NewsfeedPost({}) {
  const { getPosts, getProfilePicture, getDisplayName } = useFireContext();
  const [posts, setposts] = useState([]);
  const [postsView, setpostsView] = useState(false);

  async function handlePosts() {
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
      {posts.map((e) => {
        return (
          <>
            <Container className="d-flex p-2 mt-5 newsfeedPost">
              {e[0] ? (
                <>
                  <Image
                    src={e[0]}
                    fluid
                    thumbnail
                    roundedCircle
                    width={"150"}
                  />
                </>
              ) : (
                <Image
                  src={
                    "https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png"
                  }
                  thumbnail={true}
                  width={"100"}
                />
              )}
              <Container>
                <h5 className="text-center">
                  {e[3]} shared the post on {e[1]}{" "}
                </h5>
                <Form.Control
                  className="text-center"
                  readOnly
                  defaultValue={e[2]}
                ></Form.Control>
              </Container>
            </Container>
          </>
        );
      })}
    </>
  );
}
