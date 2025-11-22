import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../components/Home";
import Dashboard from "../components/Admin";
import NewEmployee from "../components/Admin/NewEmployee";
import PageNotFound from "../components/PageNotFound";
import Branding from "../components/Admin/Branding";
import Branch from "../components/Admin/Branch";
import Currency from "../components/Admin/Currency";
import EmployeeDashboard from "../components/Employee";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* Stard Admin Related Routes */}
        <Route path="/admin/*">
          <Route index element={<Dashboard />} />
          <Route path="branding" element={<Branding />} />
          <Route path="branch" element={<Branch />} />
          <Route path="currency" element={<Currency />} />
          <Route path="new-employee" element={<NewEmployee />} />
        </Route>
        {/* End Admin Related Routes */}
        {/* Stard Employee Related Routes */}
        <Route path="/employee/*">
          <Route index element={<EmployeeDashboard />} />
        </Route>
        {/* End Employee Related Routes */}

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
