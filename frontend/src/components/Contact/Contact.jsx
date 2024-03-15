import axios from "axios";
import React from "react";
import { useState } from "react";
import { server } from "../../server";
import { toast } from "react-toastify";
import { FaFacebook, FaInstagram, FaPhone, FaPinterest, FaTwitter } from "react-icons/fa";
import { CiLocationOn, CiMail } from "react-icons/ci";
function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(`${server}/comment/add-comment`, {
        firstName,
        lastName,
        email,
        comment,
      })
      .then((res) => {
        toast.success("Comment added successfully");
        setFirstName("");
        setEmail("");
        setLastName("");
        setComment("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="relative  top-16 bg-pattern bg-center bg-no-repeat bg-cover mix-blend-color-burn h-fit mb-20">
      <div className="text-center py-10 px-2">
        <p className="text-pink">Write a Comment</p>
        <h1 className="font-bold text-6xl pt-5">Get in Touch</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 justify-evenly items-center g-red-900 w-full sm:w-[70%] md:w-[55%] mx-auto p-10 rounded-lg"
      >
        <div className=" w-full flex flex-col sm:flex-row justify-between pb-5 gap-6">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-gray-300 text-black p-4 rounded-md sm:w-[45%]"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-gray-300 text-black p-4 rounded-md sm:w-[45%]"
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-300 text-black p-4 rounded-md w-full mb-5"
        />
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-gray-300 text-black p-4 rounded-md w-full h-40"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-pink px-4 py-2 rounded-lg mt-4 text-white mb-5"
        >
          Send
        </button>
      </form>

      <div className="contactImage h-[45vh] py-5 mb-5 flex justify-around items-center">
        <div className="bg-beige p-10 flex flex-col justify-evenly h-fit w-full md:w-[35%]">
          <p className="font-bold text-xl">Contact us</p>
          <div className="flex flex-col gap-2 my-5">
            <div className="flex gap-2">
              <CiLocationOn /> <p>Lorem ipsum dolor sit amet consectetur</p>
            </div>
            <div className="flex gap-2">
              <CiMail /> <p>lorem@gmail.com</p>
            </div>
            <div className="flex gap-2">
              <FaPhone /> <p>251 *** *** ***</p>
            </div>
          </div>

          <p className="text-pink font-bold my-2">Follow us</p>
          <div className="mt-4 md:mt-0">
            <ul className="list-reset flex ">
              <li className="mr-4">
                <a href="#">
                  <FaFacebook className="text-black text-xl hover:text-pink  transition duration-500" />
                </a>
              </li>
              <li className="mr-4">
                <a href="#">
                  <FaTwitter className="text-black text-xl hover:text-pink  transition duration-500" />
                </a>
              </li>
              <li className="mr-4">
                <a href="#">
                  <FaInstagram className="text-black text-xl hover:text-pink  transition duration-500" />
                </a>
              </li>
              <li className="mr-4">
                <a href="#">
                  <FaPinterest className="text-black text-xl hover:text-pink  transition duration-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <p className="text-pink font-bold hidden">Lorem ipsum dolor</p>
          <p className="text-pink font-bold hidden">Lorem ipsum dolor</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
