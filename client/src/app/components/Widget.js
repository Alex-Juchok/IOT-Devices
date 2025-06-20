import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useWidgets } from "../lib/WidgetRegistry";
import { MoreVertical } from "lucide-react";

const Widget = ({ data, onUpdate, onDelete }) => {
  const widgets = useWidgets();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(data.name);
  const [type, setType] = useState(data.type);
  const menuRef = useRef();
  

  const Widgetcomponent = widgets.find(w => w.type === data.type)?.component;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    onUpdate?.({ ...data, name, type });
    setEditing(false);
  };

  return (
    <div className="relative w-full p-2">
      <div className="flex justify-end">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute top-[28px] right-5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-4 top-[50px] w-36 bg-gray-300 text-black dark:bg-gray-700 dark:text-white rounded shadow-lg z-10"
        >
          <button
            onClick={() => {
              setEditing(true);
              setMenuOpen(false);
            }}
            className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left text-sm"
          >
            ✏️ Редактировать
          </button>
          <button
            onClick={() => {
              onDelete?.(data.id);
              setMenuOpen(false);
            }}
            className="block px-4 py-2 hover:bg-red-700 text-red-600 hover:text-black dark:hover:text-white w-full text-left text-sm"
          >
            🗑️ Удалить
          </button>
        </div>
      )}

      {editing ? (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mt-2 text-black dark:text-white">
          <h3 className="text-md font-semibold mb-2">Редактировать виджет</h3>
          <input
            type="text"
            className="mb-2 w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название"
          />
          <select
            className="mb-2 w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {widgets.map((w) => (
              <option key={w.type} value={w.type}>
                {w.type}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              💾 Сохранить
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:underline"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        Widgetcomponent ? (
          <Widgetcomponent
            dataPoints={data.dataValue}
            label={data.name}
            unit={data.unit}
            variant={data.variant}
            theme={theme}
          />
        ) : (
          <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-lg mt-2">
            <p>Нет подходящего виджета для типа: <strong>{data.type}</strong></p>
          </div>
        )
      )}
    </div>
  );
};

export default Widget;
