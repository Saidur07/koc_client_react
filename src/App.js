import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/404";
import "./App.css";
import Home from "./pages/home";
import Jobs from "./pages/jobs";
import JobDetails from "./pages/job/[id]";
import CategoryDetails from "./pages/category/[id]";
import Categories from "./pages/categories";
import Contact from "./pages/contact";
import Myclients from "./pages/myclients";
import Myhires from "./pages/myhires";
import Terms from "./pages/terms";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import Verify from "./pages/auth/verify";
import Forget from "./pages/auth/forget";
import OtherProfile from "./pages/profile/[id]";
import MyProfile from "./pages/profile/me";
import Settings from "./pages/profile/settings";
import Messages from "./pages/messages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/job/:id" element={<JobDetails />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:id" element={<CategoryDetails />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/verify" element={<Verify />} />
      <Route path="/auth/forget" element={<Forget />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/myclients" element={<Myclients />} />
      <Route path="/myhires" element={<Myhires />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/profile/me" element={<MyProfile />} />
      <Route path="/profile/:id" element={<OtherProfile />} />
      <Route path="/profile/settings" element={<Settings />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
