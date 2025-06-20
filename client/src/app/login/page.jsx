"use client";

import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import FloatingInput from "../components/FloatingInput";
import Image from "next/image";
import bgImg from "../images/bg.svg";
import wave from "../images/wave.png";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signin } from "../api/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { token, user, success, message } = await signin(email, password);

      if (success){
      // Сохраняем в localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Перенаправление на главную (или dashboard)
      router.push("/events/current");
      }else{
        setError(message);
        console.log()
      }
    } catch (err) {
      console.error("Ошибка входа:", err);
      setError(err?.response?.data?.message);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-[Poppins] bg-gray-200 dark:bg-gray-800">
      <Image
        src={wave}
        alt="Wave"
        className="absolute left-0 bottom-0 h-full w-auto z-[-1]"
      />
      <div className="grid md:grid-cols-2 h-full px-6 gap-10">
        {/* Left Image */}
        <div className="hidden md:flex items-center justify-end">
          <Image src={bgImg} alt="Background" className="w-[500px]" />
        </div>

        {/* Login Form */}
        <div className="flex flex-col justify-center items-center text-center">
          <form onSubmit={handleLogin} className="w-[320px]">
            <h2 className="text-3xl font-bold uppercase mb-6 text-black dark:text-white">
              Добро пожаловать
            </h2>

            <FloatingInput
              icon={MdEmail}
              placeholder="Эл. почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FloatingInput
              icon={FaLock}
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-500 text-black dark:text-white py-3 rounded-2xl uppercase text-lg font-semibold transition-all duration-300"
            >
              Войти
            </button>
          </form>

          <Link
            href={"/register"}
            className="text-gray-500 dark:text-gray-300 text-xl mt-5 hover:text-green-500 transition"
          >
            Нет аккаунта? Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
