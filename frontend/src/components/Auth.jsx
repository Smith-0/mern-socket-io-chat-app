import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar } from "@chakra-ui/react";

// import { signUp, signIn } from "../actions/users";
import mainLogo from "../images/logo/main_logo_png.png";

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picHolderUrl, setPicHolderUrl] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    phone_number: "",
    password: "",
    cpassword: "",
  });
  const apiUrl = "https://mern-chat-app-socket.herokuapp.com";

  useEffect(() => {
    let passwordInput = document.getElementById("password");
    let phone_numberInput = document.getElementById("phone_number");
    if (!isSignUp) {
      phone_numberInput?.classList.add("rounded-t-md");
      passwordInput?.classList.add("rounded-b-md");
    } else if (isSignUp) {
      phone_numberInput?.classList.remove("rounded-t-md");
      passwordInput?.classList.remove("rounded-b-md");
    }
  }, [isSignUp]);

  const handleOnChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const formData = new FormData();

  const handleUploadImage = (e) => {
    setPicHolderUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (userData.password === userData.cpassword) {
        for (var key in userData) {
          formData.append(key, userData[key]);
        }
        var imagefile = document.querySelector("#picture");
        formData.append("picture", imagefile.files[0]);
        try {
          const { data } = await toast.promise(
            await axios.post(`${apiUrl}/user/register`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }),
            {
              pending: "Logging in....",
              success: "Logged in successfully",
              error: "something went wrong",
            }
          );
          localStorage.setItem("userData", JSON.stringify(data));
          navigate("/chats");
        } catch (error) {
          toast.error(error.message);
          console.log(error);
        }
      } else {
        toast.error("Password's must match!");
      }
    } else {
      try {
        const { data } = await toast.promise(
          axios.post(`${apiUrl}/user/login`, userData),
          {
            pending: "Logging in....",
            success: "Logged in successfully",
            error: "something went wrong",
          }
        );
        // const { data } = await axios.post(
        //   `${apiUrl}user/login`,
        //   userData
        // );
        localStorage.setItem("userData", JSON.stringify(data));
        navigate("/chats");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data);
      }
    }
  };

  const loginWithGuestUser = async (type) => {
    let guestUserData;
    if (type === "jhon") {
      guestUserData = {
        phone_number: "1234567890",
        password: "123",
      };
    } else {
      guestUserData = {
        phone_number: "0987654321",
        password: "123",
      };
    }

    try {
      const { data } = await toast.promise(
        axios.post(`${apiUrl}/user/login`, guestUserData),
        {
          pending: "Logging in....",
          success: "Logged in successfully",
          error: "something went wrong",
        }
      );
      localStorage.setItem("userData", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  return (
    <div className="relative login_page_bg" style={{ height: "100vh" }}>
      <div className="w-[100%] sm:w-[90%] md:w-[70%] lg:w-[65%] xl:w-[55%] mx-auto absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-center">
        <div className="bg-[#075E54]/20 shadow-xl p-7 md:p-10 rounded-md place-content-center max-w-md w-full space-y-8">
          <div>
            <div className="login__logo_container">
              {isSignUp ? (
                <div className="ml-[9.5rem]">
                  <label htmlFor="picture">
                    <Avatar
                      id="pictureHolder"
                      cursor="pointer"
                      bg="gray.400"
                      textColor="white"
                      name={userData.name}
                      src={picHolderUrl}
                      size="lg"
                    />
                  </label>
                </div>
              ) : (
                <img
                  className="mx-auto h-24 w-auto"
                  src={mainLogo}
                  alt="Workflow"
                />
              )}
            </div>

            <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-white">
              {isSignUp ? "Sign Up to continue" : "Sign in to your account"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <span
                onClick={() => setIsSignUp((prev) => !prev)}
                className="cursor-pointer font-medium text-gray-800 hover:text-black"
              >
                {isSignUp
                  ? "Already registered? Sign in here"
                  : "New User? Sign up here"}
              </span>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(e) => handleOnSubmit(e)}>
            <div className="rounded-md shadow-sm -space-y-px">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <input
                    value={userData.name}
                    onChange={handleOnChange}
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="name"
                    required
                    className="bg-[#f9f9f9] appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Name"
                  />
                </div>
              )}
              <div>
                <label htmlFor="phone_number" className="sr-only">
                  Phone Number
                </label>
                <input
                  value={userData.phone_number}
                  onChange={handleOnChange}
                  onInput={(e) =>
                    (e.target.value = e.target.value.slice(0, 10))
                  }
                  id="phone_number"
                  name="phone_number"
                  type="number"
                  maxLength="10"
                  required
                  className="bg-[#f9f9f9] appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  value={userData.password}
                  onChange={handleOnChange}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="bg-[#f9f9f9] appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              {isSignUp && (
                <>
                  <div>
                    <label htmlFor="cpassword" className="sr-only">
                      Confirm Password
                    </label>
                    <input
                      value={userData.cpassword}
                      onChange={handleOnChange}
                      id="cpassword"
                      name="cpassword"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="bg-[#f9f9f9] appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm rounded-b-md"
                      placeholder="Confirm Password"
                    />
                  </div>
                  <div>
                    <input
                      onChange={handleUploadImage}
                      id="picture"
                      name="picture"
                      type="file"
                      className="hidden"
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#128C7E]/50 hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#128C7E]/50"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  {!loading ? (
                    <FiLock />
                  ) : (
                    <CircularProgress color="inherit" size={20} />
                  )}
                </span>
                {!isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>

          <h1 className="text-white text-center font-normal text-2xl or__text">
            <span>Or</span>
          </h1>
          <div>
            <button
              onClick={() => loginWithGuestUser("jhon")}
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#128C7E]/50 hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#128C7E]/50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <FiLock />
              </span>
              Continue With Guest User Jhon
            </button>
            <button
              onClick={() => loginWithGuestUser("jane")}
              type="button"
              className="mt-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#128C7E]/50 hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#128C7E]/50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <FiLock />
              </span>
              Continue With Guest User Jane
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
