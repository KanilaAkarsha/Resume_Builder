import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/features/authSlice";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutUser = () => {
    // Implement your logout logic here

    navigate("/");
    dispatch(logout());
  };
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto py-3.5 px-4 text-slate-800 transition-all">
        <Link to="/">
          <img src="/logo.svg" alt="Logo" className="h-11 w-auto" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden">Hi, {user?.name}</p>
          <button
            onClick={logoutUser}
            className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
