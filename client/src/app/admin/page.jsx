"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import Layout from "../components/Layout";
import { createUser, updateUser, deleteUser, getAllUsers } from "../api/userService"; 

const roles = ["viewer", "operator", "admin"];

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: "", username: "", password: "", role: "viewer" });
  const [forbidden, setForbidden] = useState(false);

   useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
        const users = await getAllUsers();
        setUsers(users.users);
      } catch (err) {
        if (err.response?.status === 403) {
          setForbidden(true);
        } else {
          console.error("Ошибка загрузки пользователей", err);
        }
      }
    };

  const handleCreate = async () => {
    try {
      await createUser(newUser.username, newUser.email, newUser.password, newUser.role);
      setNewUser({ email: "", username: "", password: "", role: "viewer" });
      await loadUsers();
    } catch (error) {
      alert("Ошибка при создании пользователя");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(editingUser.id, editingUser.username, editingUser.email, editingUser.password, editingUser.role);
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      alert("Ошибка при обновлении пользователя");
    }
  };

  const handleDelete = async (id, username) => {
    if (!confirm("Удалить пользователя?")) return;
    try {
      await deleteUser(id, username);
      await loadUsers();
    } catch (error) {
      alert("Ошибка при удалении пользователя");
    }
  };

  if (forbidden) {
    return (
      <Layout>
        <div className="p-8 max-w-2xl mx-auto text-red-600 dark:text-red-400 text-center text-xl">
          🚫 У вас нет доступа к панели администратора (403 Forbidden).
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto text-black dark:text-white">
        <h1 className="text-3xl font-bold mb-6">👮 Панель администратора</h1>

        {/* Список пользователей */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Пользователи</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="p-2">Email</th>
                <th className="p-2">Имя</th>
                <th className="p-2">Роль</th>
                <th className="p-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.username}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => setEditingUser({ ...user, password: "" })} className="cursor-pointer mr-2">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(user.id, user.username)} className="text-red-500 cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Форма редактирования */}
        {editingUser && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Редактирование пользователя</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Email"
                className="p-2 bg-gray-300 dark:bg-gray-700 rounded"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Имя"
                className="p-2 bg-gray-300 dark:bg-gray-700 rounded"
                value={editingUser.username}
                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Новый пароль"
                className="p-2 bg-gray-300 dark:bg-gray-700 rounded"
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              />
              <select
                className="p-2 bg-gray-300 dark:bg-gray-700 rounded"
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer">
                💾 Сохранить
              </button>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:underline cursor-pointer">
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Создание нового пользователя */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Создать нового пользователя</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Email"
              className="p-2 bg-gray-300 dark:bg-gray-700 rounded"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Имя"
              className="p-2 bg-gray-300 dark:bg-gray-700 rounded"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Пароль"
              className="p-2 bg-gray-300 dark:bg-gray-700 rounded"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <select
              className="p-2 bg-gray-300 dark:bg-gray-700 rounded"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer"
          >
            <Plus size={16} /> Добавить
          </button>
        </div>
      </div>
    </Layout>
  );
}
