import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div className=" bg-sky-700 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-black hover:text-slate-100 font-bold tracking-tight">
          <Link to="/">Booking.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                className="flex items-center text-white text-opacity-100 px-3 font-bold hover:bg-white hover:text-black hover:rounded-lg"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-white text-opacity-100 px-3 font-bold hover:bg-white hover:text-black hover:rounded-lg"
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-sky-800  px-3 font-bold hover:bg-gray-200 boder rounded"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
