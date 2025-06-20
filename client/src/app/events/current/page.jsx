"use client"
// events/current/page.js
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import Layout from "../../components/Layout";
import DeviceCard from "../../components/DeviceCard";

import { loadPlugins } from "../../lib/loadWidgets";
import { WidgetRegistryProvider } from "../../lib/WidgetRegistry";
import Widget from "../../components/Widget";

import { Plus } from "lucide-react";
import { connectSocket, getSocket } from "../../lib/socket";
import axios from "axios";
import { createDevice, deleteDevice, toggleDevice, updateDevice } from "@/app/api/deviceService";
import AddOrEditDeviceModal from "@/app/components/AddorEditDeviceModal";
import { useLocations } from "@/app/context/LocationsContext";
import toast from 'react-hot-toast';



export default function Dashboard() {
  const searchParams = useSearchParams();
const room = searchParams.get("room") || "Room A";
  const [widgets, setWidgets] = useState([]);

  const [devices, setDevices] = useState([]);
const [chartData, setChartData] = useState([]);


const [isModalOpen, setIsModalOpen] = useState(false);
const [newType, setNewType] = useState("chart1");
const [newDevice, setNewDevice] = useState(devices[0]?.type || "");
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
 
const { locations, setLocations } = useLocations();
const [editingDevice, setEditingDevice] = useState(null);


const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);



const handleAddWidget = () => {
  const newWidget = {
    type: newType,
    sourceType: newDevice,
    dataValue: [],
  };
  setChartData((prev) => [...prev, newWidget]);
  closeModal();
};

      useEffect(() => {
        // Загружаем пользователя из localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          const storedAccessToken = localStorage.getItem('accessToken');
          if (storedAccessToken) {
            setAccessToken(storedAccessToken);
          }
          
        }, []);

        useEffect(() => {
          if (!user || !accessToken) return;

          const fetchDevices = async () => {
            try {
              const res = await axios.get("http://localhost:5731/user/devices", {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

              const parsedDevices = res.data.devices.map((d) => ({
                id: d.device_id,
                name: d.device_name,
                type: d.device_type_name,
                room: d.location,
                status: d.status ? "online" : "offline",
                reading:
                  d.last_event?.parameters?.value !== undefined
                    ? `${d.last_event.parameters.value}${d.last_event.parameters.unit || ''}`
                    : "—",
                lastEvent: d.last_event || null,
              }));

              setDevices(parsedDevices);
            } catch (err) {
              console.error("Ошибка загрузки устройств:", err);
            }
          };

          fetchDevices();
        }, [user, accessToken]);


        useEffect(() => {
          if (!devices.length || chartData.length > 0) return;

          const randomVariant = () => (Math.random() > 0.5 ? "line" : "bar");

          const generatedChartData = devices.map((device) => ({
            id: device.id,
            name: `График: ${device.name}`,
            type: "chart1",
            variant: randomVariant(),
            unit: device.lastEvent?.parameters?.unit || "",
            sourceType: device.type,
            room: device.room, // ← добавляем!
            dataValue: [],
          }));


          const logTable = {
            name: 'Лог событий',
            type: 'table',
            dataValue: []
          };

          setChartData([...generatedChartData, logTable]);
        }, [devices]);


      useEffect(() => {
         if (!user) return;
        const socket = connectSocket(user.id);

        socket.on("device-event", (event) => {
          handleEvent(event);
        });

        return () => {
          socket.off("device-event");
          socket.disconnect();
        };
      }, [user]);


      useEffect(() => {
        loadPlugins().then(setWidgets);
      }, []);

      const handleEvent = (event) => {
        const { messages, severity, timestamp, parameters, source, id, type } = event;

        const value = parameters?.value;
        const label = new Date(timestamp).toLocaleTimeString();
        
        if (severity === "Critical Error" || severity === "Error") {
            toast((t) => (
              <div>
            <span className="mr-5">
              🚨 {messages}
            </span>
            <button onClick={() => toast.dismiss(t.id)}>
                Ok
              </button>
              </div>
          ));
          }


        // Обновление таблицы
        setChartData((prev) =>
          prev.map((w) =>
            w.type === "table"
              ? {
                  ...w,
                  dataValue: [
                    {
                      label,
                      value: messages || `Событие: ${id}`,
                      severity: severity?.toLowerCase() || "information",
                      source: source,
                      type: type
                    },
                    ...w.dataValue.slice(0, 49),
                  ],
                }
              : w
          )
        );

        const deviceId = source.replace("device:", "");

        // Обновление карточки устройства
        setDevices((prev) =>
          prev.map((device) =>
            device.name === deviceId
              ? {
                  ...device,
                  reading: value !== undefined
                    ? `${value}${parameters?.unit || ''}`
                    : "—",
                  lastEvent: event,
                }
              : device
          )
        );

        // Обновление графика
        if (value !== undefined) {
          setChartData((prev) =>
            prev.map((w) =>
              w.type.startsWith("chart") && w.name.includes(deviceId)
                ? {
                    ...w,
                    dataValue: [...w.dataValue.slice(-6), { label, value }],
                  }
                : w
            )
          );
        }
      };




        const handleDeleteDevice = async (id) => {
          await deleteDevice(id);
          setDevices((prev) => prev.filter((d) => d.id !== id));
          setChartData((prev) => prev.filter((d) => d.id !== id));
        };

        const handleToggleDevice = async (device) => {
          await toggleDevice(device.id);
          setDevices((prev) =>
            prev.map((d) =>
              d.id === device.id
                ? { ...d, status: d.status === "online" ? "offline" : "online" }
                : d
            )
          );
        };

        const handleEditDevice = (device) => {
          setEditingDevice(device);
          openModal();
        };

        const handleSaveDevice = async ({ id, name, type, room, status, users }) => {
          try {
            let deviceData;

            if (editingDevice) {
              deviceData = await updateDevice(id, name, type, room, status, users);
              setDevices((prev) =>
                prev.map((d) =>
                  d.id === id
                    ? {
                        ...d,
                        name,
                        type,
                        room: deviceData?.device,
                        status: `${status? 'online': 'offline'}`
                      }
                    : d
                )
              );

              setChartData((prevChartData) => 
                prevChartData.map((w) =>
                  w.id == id
                  ? {...w, 
                    name: `График: ${name}`,
                    room:  deviceData?.device,
                }:w
              ));
            } else {
              const newDevice = await createDevice(name, type, room);
              const created = newDevice?.device_id;
              if (!created) {
                console.error("Не удалось создать устройство.");
                return;
              }

              setDevices((prev) => [
                ...prev,
                {
                  id: created.device_id,
                  name,
                  type,
                  room: created.full_location,
                  status: "offline",
                  reading: created.event_parameters.value + created.event_parameters.unit,
                  lastEvent: null,
                },
              ]);

              // Добавление графика только при создании устройства
              const randomVariant = () => (Math.random() > 0.5 ? "line" : "bar");
              setChartData((prevChartData) => [
                ...prevChartData,
                {
                  id: created.device_id,
                  name: `График: ${name}`,
                  type: "chart1",
                  variant: randomVariant(),
                  unit: created.event_parameters.unit,
                  sourceType: type,
                  room: created.full_location, // ← добавляем
                  dataValue: [],
                },
              ]);

            }
          } catch (err) {
            console.error("Ошибка при сохранении устройства:", err);
          }
        };

  return (
    <>
    <WidgetRegistryProvider widgets={widgets}>
      <Layout>
        <div className="p-4 space-y-8">
          {/* ===== Устройства ===== */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-black dark:text-white">📟 Устройства</h2>
              <button
                onClick={() => {
                  setEditingDevice(null);
                  openModal();
                }}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-black dark:text-white px-3 py-1 rounded flex items-center gap-2"
              >
                <Plus size={16} /> Добавить устройство
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {devices
                .filter((device) => device.room === room)
                .map((device) => (
                  <DeviceCard 
                    key={device.id} 
                    device={device} 
                    onDelete={handleDeleteDevice}
                    onToggle={handleToggleDevice}
                    onEdit={handleEditDevice}/>
                ))}
            </div>
          </section>


          {/* ===== Виджеты: Графики ===== */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-black dark:text-white">📊 Графики</h2>
              <button
                onClick={openModal}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-black dark:text-white px-3 py-1 rounded flex items-center gap-2"
              >
                <Plus size={16} /> Добавить виджет
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chartData
              .filter(w => w.type === 'chart1' && w.room === room)
              .map((tdata, index) => (
                <Widget key={`widget-${index}`} data={tdata} />
            ))}

            </div>
          </section>


          {/* ===== Виджеты: Таблицы ===== */}
          <section>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">📋 Таблицы</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {chartData.filter(w => w.type === 'table').map((tdata, index) => (
                <Widget key={`table-${index}`} data={tdata} />
              ))}
            </div>
          </section>

          
        </div>

        <AddOrEditDeviceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveDevice}
          device={editingDevice} // или null
          rooms={locations}
        />

      </Layout>
    </WidgetRegistryProvider>
</>
  );
}
