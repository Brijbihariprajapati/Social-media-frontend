import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import DataTable from "./DataTable";
import Update from "./Update";
import Password from "./Password";
import ForgetPassword from "./ForgetPass";
import RessetPassword from "./RessetPassword";
import CreatePostForm from "./CreatePostForm";
import PostView from "./PostView";
import PostCardList from "./PostCardList";
import Reportt from "./Reportt";
import ReportCard from "./ReportCard";
import PostList from "./PostList";
import MessageList from "./MessageList";
import LikedPost from "./LikedPost";
import AllNotificationList from "./AllNotificationList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/view/:id/:name" element={<DataTable />} />
        <Route path="/update/:id" element={<Update />} />
        <Route path="/FPassword/:id" element={<Password />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/ressetPassword" element={<RessetPassword />} />
        <Route path="/createpost" element={<CreatePostForm />} />
        <Route path="/postcardlist" element={<PostCardList />} />
        <Route path="/postview" element={<PostView />} /> {/* Corrected path */}
        <Route path="/report/:id" element={<Reportt/>} />
        <Route path="/reportcard" element={<ReportCard/>} />
        <Route path="/postList" element={<PostList/>} />
        <Route path="/messagelist" element={<MessageList/>} />
        <Route path="/likedpost/:postId" element={<LikedPost />} />
        <Route path='/AllNotificationList' element={<AllNotificationList />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
