import NavbarComponent from "./NavbarComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useFireContext } from "../Context";
import Profile from "../Pages/Profile";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Search from "../Pages/Search";
import Marks from "../Pages/Marks";
import Inbox from "../Pages/Inbox";
import Friends from "../Pages/Friends";
import NewsFeed from "../Pages/Newsfeed";
import Conversation from "../Pages/Conversation";
import Notifications from "../Pages/Notifications";

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
            <Route path="/search" element={<Search />} />
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/notifications" element={<Notifications />} />
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
