import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { useWidgets } from "../lib/WidgetRegistry";
import { useTheme } from "../context/ThemeContext";

const DeviceCard = ({ device, onDelete, onToggle, onEdit }) => {
  const widgets = useWidgets();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const { theme, toggleTheme } = useTheme();

  const WidgetComponent = widgets.find(w => w.type === device.type)?.component;

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 text-black dark:from-gray-800 dark:to-gray-900 dark:text-white rounded-xl shadow-lg p-6 pb-10 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {device.type}
        </div>
        
        <div className="relative" ref={menuRef}>
          <span
          className={`text-sm px-2 py-1 rounded ${device.status === "online" ? "bg-green-500" : "bg-red-500"} 
          `}
        >
          {device.status}
        </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-gray-300 text-black dark:bg-gray-700 dark:text-white rounded shadow-lg z-10">
              <button
                onClick={() => {
                  onEdit?.(device);
                  setMenuOpen(false);
                }}
                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left text-sm"
              >
                Редактировать
              </button>
              <button
                onClick={() => {
                  onToggle?.(device);
                  setMenuOpen(false);
                }}
                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left text-sm"
              >
                {device.status === "online" ? "Отключить" : "Включить"}
              </button>
              <button
                onClick={() => {
                  onDelete?.(device.id);
                  setMenuOpen(false);
                }}
                className="block px-4 py-2 hover:bg-red-700 text-red-600 hover:text-black dark:hover:text-white w-full text-left text-sm"
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-center">{device.name}</h3>

      <div className="flex justify-center items-center">
        {WidgetComponent ? (
          <WidgetComponent theme={theme} value={parseFloat(device.reading)} {...device} />
        ) : (
          <p>Нет виджета</p>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;
