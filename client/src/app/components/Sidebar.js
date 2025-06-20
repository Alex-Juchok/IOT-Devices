"use client";

import Link from "next/link";
import avatar from "../images/avatar.svg";
import Image from "next/image";
import {
  Minimize2,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar = ({ user, rooms = [], onAddRoom, isCollapsed, setIsCollapsed }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [roomsExpanded, setRoomsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleRoom = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filterTreeByName = (nodes, term) => {
    return nodes
      .map((node) => {
        const children = filterTreeByName(node.children || [], term);
        const matches = node.name.toLowerCase().includes(term.toLowerCase());
        if (matches || children.length > 0) {
          return {
            ...node,
            children,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const buildTree = (nodes, parentId = null) =>
  nodes
    ?.filter((room) => room.parent_id === parentId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((room) => ({
      ...room,
      children: buildTree(nodes, room.location_id),
    }));


  const treeData = buildTree(rooms);
  const visibleTree = searchTerm ? filterTreeByName(treeData, searchTerm) : treeData;

  const roomMap = useMemo(() => {
      const map = new Map();
      rooms?.forEach((room) => {
        map.set(room.location_id, room);
      });
      return map;
    }, [rooms]);

    const getRoomPath = (room) => {
      const path = [];
      let current = room;
      while (current) {
        path.unshift(current.name);
        current = roomMap.get(current.parent_id);
      }
      return path.join(".");
    };

  const renderRoomNode = (room, level = 0) => {
    const isExpanded = expandedNodes[room.location_id];
    const hasChildren = room.children && room.children.length > 0;


    return (
      <div key={room.location_id} className={`group pl-${level * 4}`}>
        <div className="flex items-center justify-between text-sm px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          <div className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
            {hasChildren && (
              <button onClick={() => toggleRoom(room.location_id)} className="mr-1">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
              <div
                onClick={() => router.push(`/events/current?room=${getRoomPath(room)}`)}
              >
                {!hasChildren && <span className="w-[16px] inline-block" />}
                <span>🛋️ {room.name}</span>
              </div>
            </div>
          <button
            className="opacity-0 hover:opacity-100 transition-opacity"
            onClick={() => onAddRoom(room)}
          >
            <Plus size={14} className="text-gray-500 hover:text-black dark:hover:text-white" />
          </button>
        </div>
        {isExpanded && hasChildren && (
          <div className="pl-4">
            {room.children.map((child) => renderRoomNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`bg-gray-300 text-black dark:bg-gray-900 dark:text-white h-screen fixed top-0 left-0 p-4 flex flex-col transition-all duration-300 shadow-lg ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Профиль */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden relative border-2 border-black dark:border-white">
            <Image src={avatar} alt="Profile" fill className="object-cover rounded-full" onClick={toggleCollapse} />
          </div>
          {!isCollapsed && (
            <div>
              <div className="font-semibold text-lg">{user?.username || "Гость"}</div>
              <div className="text-sm text-gray-700 dark:text-gray-400">{user?.role || "Нет роли"}</div>
            </div>
          )}
        </div>
        <button onClick={toggleCollapse} className="ml-auto text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white">
          {isCollapsed ? "" : <Minimize2 size={20} />}
        </button>
      </div>

      {/* Навигация */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {/* Текущие события */}
          <li>
            <button onClick={() => setRoomsExpanded(!roomsExpanded)} className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800'>
              <span>🟢</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Текущие события</span>
                  {roomsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </>
              )}
            </button>
            {!isCollapsed && roomsExpanded && (
              <div className="pl-4 mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Поиск локаций..."
                  className="w-[99%] px-2 py-1 rounded bg-gray-100 text-black dark:bg-gray-800 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                 {/* Кнопка добавления */}
                <button
                  onClick={() => onAddRoom()}
                  className="flex items-center text-sm gap-2 px-2 py-1 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md w-full"
                >
                  <Plus size={14} /> Добавить локацию
                </button>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                  {visibleTree
                    ?.map((room) => renderRoomNode(room))}
                </div>
              </div>
            )}
          </li>

          {/* Архив */}
          <li>
            <Link href="/events/archive" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              <span>📁</span>
              {!isCollapsed && <span>Архивные события</span>}
            </Link>
          </li>

          {/* Остальное */}
          <hr className="my-6 border-gray-400 dark:border-gray-700" />
          <li>
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              <span>📟</span>
              {!isCollapsed && <span>Панель админа</span>}
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              <span>⚙️</span>
              {!isCollapsed && <span>Настройки</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
