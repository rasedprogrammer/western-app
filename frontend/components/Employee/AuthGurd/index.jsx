const AuthGurd = ({ children }) => {
  const { employee } = useSelector((state) => state.employeeAuth);
  if (!employee || !employee._id) {
    return <Navigate to="/employee/login" replace />;
  }
  return children;
};

export default AuthGurd;
