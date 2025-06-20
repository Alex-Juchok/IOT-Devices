import { useState, useMemo, useRef, useEffect } from 'react';

const SEVERITY_OPTIONS = [
  { value: 'information', label: 'Информация' },
  { value: 'notification', label: 'Уведомление' },
  { value: 'warning', label: 'Предупреждение' },
  { value: 'error', label: 'Ошибка' },
  { value: 'critical error', label: 'Критическая' },
];

const TableWidget = ({ dataPoints, label }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedSeverities, setSelectedSeverities] = useState(SEVERITY_OPTIONS.map(o => o.value));
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const toggleSelectRow = (label) => {
    setSelectedRows((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const deleteSelected = () => {
    console.log(selectedRows)
    // onDeleteRows?.(selectedRows);
    setSelectedRows([]);
  };

  const toggleSort = () => setSortAsc(!sortAsc);

  const handleSeverityChange = (severity) => {
    setPage(1);
    setSelectedSeverities(prev =>
      prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  const filteredData = useMemo(() => {
    return dataPoints
      .filter(d => selectedSeverities.includes(d.severity))
      .sort((a, b) => {
        return sortAsc
          ? a.label.localeCompare(b.label)
          : b.label.localeCompare(a.label);
      });
  }, [dataPoints, selectedSeverities, sortAsc]);

  const [filterOpen, setFilterOpen] = useState(false);
  const dropdownRef = useRef();

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage);


  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow-md col-span-1 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <h3 className="text-black dark:text-white text-lg font-semibold">{label}</h3>

      {/* === Dropdown фильтр === */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white px-3 py-2 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Фильтр по уровню
        </button>

        {filterOpen && (
          <div className="absolute mt-2 right-0 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-10 min-w-[200px]">
            <div className="p-3 space-y-2">
              {SEVERITY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center text-sm text-black dark:text-white space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="accent-green-500"
                    checked={selectedSeverities.includes(opt.value)}
                    onChange={() => handleSeverityChange(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

      {selectedRows.length > 0 && (
        <div className='flex flex-1 mr-5 pr-5'>
          <button
            onClick={deleteSelected}
            className="text-red-400 hover:text-red-300 text-sm mb-3"
          >
            Удалить выбранные
          </button>
          <button
            onClick={deleteSelected}
            className="text-black dark:text-white  hover:text-gray-800 dark:hover:text-gray-200 text-sm mb-3"
          >
            Признать событие
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-black dark:text-white table-auto">
          <thead className="border-b border-gray-300 dark:border-gray-600">
            <tr>
              <th className="px-2 py-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const currentLabels = paginatedData.map(d => d.label);
                    if (e.target.checked) {
                      setSelectedRows([...new Set([...selectedRows, ...currentLabels])]);
                    } else {
                      setSelectedRows(selectedRows.filter((l) => !currentLabels.includes(l)));
                    }
                  }}
                  checked={paginatedData.every(row => selectedRows.includes(row.label))}
                />
              </th>
              <th
                className="px-4 py-2 cursor-pointer text-gray-500 dark:hover:text-gray-300"
                onClick={toggleSort}
              >
                Время {sortAsc ? '↑' : '↓'}
              </th>
              <th className="px-4 py-2">Сообщение</th>
              <th className="px-4 py-2">Серьёзность</th>
              <th className="px-4 py-2">Источник</th>
              <th className="px-4 py-2">Тип</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((point, i) => (
              <tr
                key={i}
                className={`border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedRows.includes(point.label) ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <td className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(point.label)}
                    onChange={() => toggleSelectRow(point.label)}
                  />
                </td>
                <td className="px-4 py-2">{point.label}</td>
                <td className="px-4 py-2">{point.value}</td>
                <td className="px-4 py-2 capitalize">{point.severity}</td>
                <td className="px-4 py-2">{point.source}</td>
                <td className="px-4 py-2">{point.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="flex justify-end mt-4 space-x-2 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-black dark:text-white text-sm">На странице:</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white text-sm rounded px-2 py-1"
          >
            {[5, 10, 15, 20, 25].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded disabled:opacity-30"
        >
          Назад
        </button>
        <span className="text-black dark:text-white px-2 py-1">Страница {page} из {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded disabled:opacity-30"
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default {
  type: 'table',
  name: 'Table Widget',
  component: TableWidget,
};
