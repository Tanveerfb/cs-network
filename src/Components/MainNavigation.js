import NavbarComponent from "./NavbarComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useFireContext } from "../Context";
import Profile from "../Pages/Profile";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Friends from "../Pages/Friends";
import Marks from "../Pages/Marks";
import Inbox from "../Pages/Inbox";
import Welcome from "./Welcome";
import NewsFeed from "../Pages/Newsfeed";
import Conversation from "../Pages/Conversation";

function MainNavigation() {
  const { user, admin } = useFireContext();

  if (user && user.email) {
    return (
      <>
        <Router>
          <NavbarComponent />
          <Routes>
            <Route path="/" element={<NewsFeed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/marks" element={<Marks />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/conversation" element={<Conversation />} />
          </Routes>
        </Router>
      </>
    );
  } else {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    );
  }
}

export default MainNavigation;
