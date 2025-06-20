import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getDeviceTypes } from "../api/deviceService";
import { getUserData } from "../api/userService";

const AddOrEditDeviceModal = ({
  isOpen,
  onClose,
  onSubmit,
  device = null,
  rooms = [],
  defaultRoom = null,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [room, setRoom] = useState(null);
  const [status, setStatus] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    const fetchTypesAndUsers = async () => {
      const res = await getDeviceTypes();
      setDeviceTypes(res.device_types || []);
      const usersRes = await getUserData();
      setAllUsers(usersRes.users || []);
    };

    fetchTypesAndUsers();
  }, []);

  useEffect(() => {
    if (device) {
      setName(device.name);
      setType(device.type);
      setRoom(device.room_id);
      setStatus(device.status == 'online'? true : false || false);
      setAssignedUsers(device.users || []);
    } else {
      setName("");
      setType("");
      setRoom(defaultRoom || null);
      setStatus(false);
      setAssignedUsers([]);
    }
    setSelectedUserIds([]);
  }, [device, isOpen]);

  const handleSubmit = () => {
    const users = assignedUsers.map((u) => ({ user_id: u.id }));
    onSubmit({
      name,
      type,
      room,
      status,
      users,
      id: device?.id,
    });
    onClose();
  };

  const handleAddUsers = () => {
    const newUsers = allUsers.filter(
      (user) =>
        selectedUserIds.includes(user.id.toString()) &&
        !assignedUsers.some((au) => au.id === user.id)
    );
    setAssignedUsers((prev) => [...prev, ...newUsers]);
    setSelectedUserIds([]);
  };

  const handleRemoveUser = (id) => {
    setAssignedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  if (!isOpen) return null;

 return (
  <div className="fixed inset-0 bg-black  bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded">
    <div className="bg-white dark:bg-gray-800 p-6 w-full max-w-4xl relative flex flex-col sm:flex-row gap-6">
      {/* Кнопка закрытия */}
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
        <X size={20} />
      </button>

      {/* Левая панель */}
      <div className="flex-1 overflow-y-auto max-h-[80vh] pr-3">
        <h3 className="text-xl font-semibold mb-4">
          {device ? "Редактировать устройство" : "Добавить устройство"}
        </h3>

        <label className="block mb-1 text-sm">Имя устройства</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        />

        <label className="block mb-1 text-sm">Тип устройства</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        >
          {deviceTypes.map((t) => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </select>

        <label className="block mb-1 text-sm">Комната</label>
        <select
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        >
          {rooms.map((r) => (
            <option key={r.location_id} value={r.location_id}>{r.name}</option>
          ))}
        </select>

        {device && (
          <>
            <label className="block mb-1 text-sm">Статус устройства</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            >
              <option value={true}>🟢 Online</option>
              <option value={false}>🔴 Offline</option>
            </select>
          </>
        )}
      </div>

      {/* Правая панель */}
      {device && (
        <div className="flex-1 overflow-y-auto max-h-[80vh] pl-3">
          <label className="block mb-1 text-sm">Назначенные пользователи</label>
          <div className="mb-3 space-y-1">
            {assignedUsers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                <span>{user.username}</span>
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <label className="block mb-1 text-sm">Добавить пользователей</label>
          <select
            multiple
            value={selectedUserIds}
            onChange={(e) =>
              setSelectedUserIds(Array.from(e.target.selectedOptions, (o) => o.value))
            }
            className="w-full h-32 px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          >
            {allUsers
              .filter((u) => !assignedUsers.some((au) => au.id === u.id))
              .map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
          </select>

          <button
            onClick={handleAddUsers}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded w-full"
          >
            ➕ Добавить выбранных
          </button>
        </div>
      )}
    </div>

    {/* Кнопка подтверждения под окном */}
    <div className=" bottom-6 w-full max-w-4xl px-6 mb-3">
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        {device ? "Сохранить изменения" : "Добавить устройство"}
      </button>
    </div>
    </div>

  </div>
);

};

export default AddOrEditDeviceModal;
