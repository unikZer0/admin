import { BrowserRouter as Router, Routes, Route } from "react-router"; 
import SignIn from "./pages/AuthPages/SignIn";
import UserProfiles from "./pages/UserProfiles";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import FormElements from "./pages/Forms/FormElements";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Shop from "./pages/Shop/Shop";
import User from "./pages/User/User";
import Product from "./pages/Product/Product";
import ProtectedRoute from "../src/components/ProtectedRoute/ProtectedRoute";
import AdminProtectRoute from "../src/components/ProtectedRoute/AdminProtectRoute";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<SignIn />} />

        {/* Protected User Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index path="/dashboard" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/shops" element={<Shop />} />
          <Route path="/users" element={<User />} />
          <Route path="//products" element={<Product />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />

          {/* Admin-only route inside protected layout */}
          {/* <Route
            path="/products"
            element={
              <AdminProtectRoute>
                <Product />
              </AdminProtectRoute>
            }
          /> */}
        </Route>
      </Routes>
    </Router>
  );
}
