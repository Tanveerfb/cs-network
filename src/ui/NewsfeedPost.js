import React, { useState, useEffect } from "react";
import { Container, Image, Form } from "react-bootstrap";
import { useFireContext } from "../Context";
import Posts from "./Posts";

export default function NewsfeedPost({}) {
  const { getPosts, getProfilePicture, getDisplayName } = useFireContext();
  const [posts, setposts] = useState([]);
  const [postsView, setpostsView] = useState(false);

  async function handlePosts() {
    setposts([]);
    const data = await getPosts("public");
    console.log(data);
    data.forEach((post) => {
      // console.log(post.data());
      const text = post.data().text;
      const uid = post.data().uid;
      const dateTime = post.data().datePosted;
      getProfilePicture(uid).then((e) => {
        getDisplayName(uid).then((f) => {
          const post = [e, dateTime, text, f, uid];
          setposts((posts) => [
            ...posts,
            <>
              <Posts
                uid={uid}
                profilePicture={e}
                displayName={f}
                time={dateTime}
                content={text}
              />
            </>,
          ]);
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
      {posts}
    </>
  );
}
