"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import avatar from "../images/avatar.svg";
import { LogOut } from "lucide-react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { updateUserData } from "../api/userService";
import { logout } from "../api/authService";

export default function SettingsPage() {
  const [user, setUser] = useState({ id: "", email: "", username: "", password: "", role: "" });
  const [language, setLanguage] = useState("ru");
  // const [theme, setTheme] = useState("dark");
  const [editingUser, setEditingUser] = useState(false);
    const { theme, toggleTheme } = useTheme();

console.log(theme)
  const additionalSettings = [
    {
        name: "🔔 Уведомления",
        description: "Включить или отключить уведомления.",
        href: "/settings/notifications"
    },
    {
        name: "🛡️ Безопасность",
        description: "Изменить методы входа, 2FA и др.",
        href: "/settings/security"
    },
    {
        name: "📦 Интеграции",
        description: "Настройка внешних сервисов и API.",
        href: "/settings/integrations"
    },
  ];

  useEffect(() => {
        // Загружаем пользователя из localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }, []);

  const handleSave = async () => {
    try{
        await updateUserData(user.id, user.username, user.email,  user.password, user.role );
        localStorage.setItem("user", JSON.stringify(user));
        alert("Изменения сохранены!");
        setEditingUser(false);
    }catch (error) {
        alert("Ошибка при обновлении данных пользователя");
      }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      alert(error);
    }
  };

  // const handleUpdate = () => {
  //   setUser(user);
  // };

   return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white ">⚙️ Настройки</h1>

        {/* Профиль */}
        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Профиль</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-black dark:border-white">
              <Image src={avatar} alt="Аватар" fill className="object-cover" />
            </div>
            <div>
              <p className="text-lg font-medium">Имя: {user.username}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email: {user.email || "Email пользователя"}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Роль: {user.role}</p>
            </div>
          </div>

          {editingUser && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Email"
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Логин"
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Новый пароль"
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            {editingUser ? (
              <div>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer text-white"
                >
                  💾 Сохранить
                </button>
                <button
                  onClick={() => setEditingUser(false)}
                  className="text-gray-600 dark:text-gray-400 hover:underline ml-4 cursor-pointer"
                >
                  Отмена
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingUser(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer text-white"
              >
                ✏️ Изменить
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
            >
              <LogOut size={16} /> Выйти
            </button>
          </div>
        </section>

        {/* Интерфейс */}
        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Интерфейс</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Язык</label>
              <select
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded w-full"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Тема</label>
              <select
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded w-full"
                value={theme}
                onChange={(e) => toggleTheme(e.target.value)}
              >
                <option value="dark">Темная</option>
                <option value="light">Светлая</option>
              </select>
            </div>
          </div>
        </section>

        {/* Дополнительно */}
        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4">Дополнительно</h2>
          {additionalSettings.map((setting, index) => (
            <Link key={index} href={setting.href}>
              <div className="gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                <h3 className="text-lg font-medium mb-1">{setting.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </Layout>
  );
}
