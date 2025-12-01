import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Navigate to={"/"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateUser />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user/:id" element={<UserDetail />} />
        <Route path="/user/:id/edit" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
