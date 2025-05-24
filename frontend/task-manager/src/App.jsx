import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

// Admin Pages
import ManageTask from "./pages/Admin/ManageTask";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import Dashboard from "./pages/Admin/Dashboard";

// User Pages
import UserDashboard from "./pages/User/Dashboard";
import MyTask from "./pages/User/MyTask";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTask />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTask />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
          </Route>

        </Routes>
      </Router>
    </div>
  );
};

export default App;
