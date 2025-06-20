"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import Widget from "../../components/Widget";
import { WidgetRegistryProvider } from "../../lib/WidgetRegistry";
import { loadPlugins } from "../../lib/loadWidgets";
import { getEventHistory } from "@/app/api/events";

export default function ArchiveEventsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState([]);
  const [widgets, setWidgets] = useState([]);

  const handleFetch = async () => {
    try {
      const res = await getEventHistory(startDate, endDate)
   
      const events = res.events || [];
      const grouped = {};

      // Группировка событий по устройствам
      for (const event of events) {
        const id = event.device_id;
        if (!grouped[id]) {
          grouped[id] = {
            id: id,
            name: `График: ${event.device_name}`,
            type: "chart1",
            variant: "line",
            unit: event.parameters?.unit || "",
            dataValue: [],
          };
        }

        const timeLabel = new Date(event.datetime).toLocaleTimeString();
        const value = event.parameters?.currentTemperature || event.parameters?.value;

        if (value !== undefined) {
          grouped[id].dataValue.push({ label: timeLabel, value });
        }
      }

      const charts = Object.values(grouped);

      // Лог таблицы
      const logTable = {
        name: "Лог событий",
        type: "table",
        dataValue: events.map((e) => ({
          label: new Date(e.datetime).toLocaleString(),
          value: e.message,
          severity: e.severity.toLowerCase(),
          source: e.device_name,
          type: e.event_type,
        })),
      };

      setChartData([...charts, logTable]);
    } catch (err) {
      console.error("Ошибка загрузки архивных событий:", err);
    }
  };

  // Загрузка плагинов
  useEffect(() => {
    let isMounted = true;
    loadPlugins().then((widgets) => {
      if (isMounted) setWidgets(widgets);
    });

    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <WidgetRegistryProvider widgets={widgets}>
      <Layout>
        <div className="p-6 space-y-8">
          <h1 className="text-2xl font-bold text-black dark:text-white">📁 Архив событий</h1>

          {/* Выбор периода */}
          <div className="flex gap-4 items-center">
            <label className="text-sm text-black dark:text-white">
              Начало:
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="ml-2 px-2 py-1 border rounded text-white dark:text-black"
              />
            </label>
            <label className="text-sm text-black dark:text-white">
              Конец:
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="ml-2 px-2 py-1 border rounded text-white dark:text-black"
              />
            </label>
            <button
              onClick={handleFetch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Показать события
            </button>
          </div>

          {/* Графики */}
          <section>
            <h2 className="text-xl font-semibold text-black dark:text-white">📊 Графики по устройствам</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chartData.filter((c) => c.type === "chart1").map((chart, idx) => (
                <Widget key={idx} data={chart} />
              ))}
            </div>
          </section>

          {/* Таблица */}
          <section>
            <h2 className="text-xl font-semibold text-black dark:text-white mt-6">📋 Лог событий</h2>
            <div className="grid grid-cols-1">
              {chartData
                .filter((c) => c.type === "table")
                .map((table, idx) => (
                  <Widget key={`table-${idx}`} data={table} />
                ))}
            </div>
          </section>
        </div>
      </Layout>
    </WidgetRegistryProvider>
  );
}
