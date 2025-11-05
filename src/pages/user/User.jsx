import React, { useEffect, useState } from 'react';
import { IoNotifications } from 'react-icons/io5';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';
import { io } from "socket.io-client";
import { FaRocketchat } from 'react-icons/fa6';
import { RiVideoChatLine } from 'react-icons/ri';
const socket = io("https://classplut2.onrender.com");
function User() {
  const [notifications, setNotifications] = useState(false);
  const [userprofile, setuserprofile] = useState(false)
  const [User, setUsers] = useState([])
  const [notification, setNotification] = useState(null);
  const [batches, setBatches] = useState([]);
  const [liveActive, setLiveActive] = useState(false);
  let go = useNavigate()

  useEffect(() => {
    async function getBatchesData() {
      try {
        const res = await axios.get("https://classplut2.onrender.com/userBatches", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBatches(res.data.batch || []);
      } catch (error) {
        console.log(error);
      }
    }

    getBatchesData();
  }, []);

  useEffect(() => {
    // Notify when live starts
    socket.on("notify-live", (data) => {
      console.log("Live Notification:", data);

      // Only show if user's batch matches
      if (batches.some((batch) => batch._id === data.Liveclass_Id)) {
        setNotification(data.message);
        setLiveActive(true);
      }
    });

    // Notify when live ends
    socket.on("live-ended", (data) => {
      setNotification(data.message);
      setLiveActive(false);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("notify-course-live");
      socket.off("live-ended");
    };
  }, [batches]);

  useEffect(() => {
    axios.get("https://classplut2.onrender.com/profile", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then((res) => {
      // console.log(res.data.data);
      setUsers(res.data.data);
    }).catch((error) => console.log(error))
  }, []);

  let livego = (e) =>{
    e.preventDefault();
     go("/user/UserWatchLive")
  }
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* <>
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[420px] border-l-transparent border-b-[420px] border-b-blue-400 opacity-40"></div>
      <div className="absolute top-0 left-72 w-0 h-0 border-l-[300px] border-l-transparent border-b-[300px] border-b-purple-500 opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[350px] border-r-transparent border-t-[350px] border-t-green-400 opacity-40"></div>
      <div className="absolute bottom-0 left-56 w-0 h-0 border-r-[280px] border-r-transparent border-t-[280px] border-t-yellow-300 opacity-40"></div>
      <div className="absolute top-32 left-1/4 w-32 h-32 bg-blue-300 rounded-full opacity-30"></div>
      <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-green-300 rounded-full opacity-30"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-purple-400 rounded-full opacity-30"></div>
      <div className="absolute top-10 right-20 w-16 h-16 bg-yellow-400 rotate-12 opacity-40"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200 rotate-45 opacity-30"></div>
    </> */}
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-30">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 mb-4 sm:mb-0">
          <img
            className="w-14 sm:w-16"
            src="https://pixelgenixitsolution.com/assets/logo-DYymvdQZ.jpg"
            alt="PixelGenix Logo"
          />
          <div className="leading-tight">
            <h1 className="text-xl sm:text-2xl font-bold">PixelGenix</h1>
            <p className="text-sm sm:text-base font-medium">IT SOLUTIONS Pvt Ltd</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 text-base sm:text-lg font-semibold text-black bg-gray-100 px-6 py-2 rounded-full">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="Course" className="hover:text-blue-600 transition">Store</Link>
          <Link to="batches" className="hover:text-blue-600 transition">Batches</Link>
          <Link to="Payment" className="hover:text-blue-600 transition">Payment</Link>
          <Link to="buycourses" className="hover:text-blue-600 transition">Purchased</Link>
        </div>

        {/* Profile & Cart */}
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* Profile */}
           <div className="relative inline-block cursor-pointer" onClick={() => setNotifications(!notifications)}>
      {/* Notification Icon */}
      <RiVideoChatLine  className={`text-3xl ${liveActive ? "text-red-500 animate-bounce" : "text-black"}`} />

      {/* Red Dot
      {liveActive && (
        <span className="absolute top-0 right-0 block w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
      )} */}
    </div>
          <h1 className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setuserprofile(!userprofile)}>
            <span className='w-10 h-10 flex justify-center contain-content items-center text-2xl font-bold rounded-full bg-red-500 text-white '> {User?.username?.slice(0, 1)}</span>
            <span className="text-sm sm:text-base font-medium">Profile</span>
          </h1>

          {/* Cart */}
          <button
            type="button"
            className="relative hover:text-blue-600 focus:outline-none text-2xl"
            aria-label="Cart"

          >
           <Link to="/user/chatapp"><FaRocketchat /></Link>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>

      {
        notifications && (
          <div className="absolute top-16 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-40">
            <h2 className="text-xl font-semibold mb-2 border-b">Notifications</h2>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">🎓 Welcome User</h1>

              {notification && (
                <div className="bg-yellow-200 border border-yellow-500 rounded-lg p-4 mb-4 shadow-md">
                  <p>{notification}</p>
                  {liveActive && (
                    <button
                      onClick={livego()}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Join Live Class
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      {userprofile && (
        <div className="absolute top-16 right-20 w-48 bg-white shadow-lg rounded-lg p-4 z-40">
          <h2 className="text-xl font-semibold mb-2 border-b">Profile</h2>
          <div className="flex flex-col gap-3">

            <Link to="/user/exploruser" className="hover:text-blue-600 transition " onClick={() => setuserprofile(false)}>View Profile</Link>

            <Link className="hover:text-blue-600 transition"
              onClick={() => {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                window.location.reload()
              }}>
              Logout
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default User;
