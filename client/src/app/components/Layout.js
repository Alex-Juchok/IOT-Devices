// components/Layout.js
import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { createLocation, getDeviceLocation } from "../api/locationService";
import { useLocations } from "../context/LocationsContext";

const Layout = ({ children }) => {
    const { locations, setLocations } = useLocations();
    const [user, setUser] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        loadLocations();
      }, []);

        const loadLocations = async () => {
      try {
        const location = await getDeviceLocation();
        if (setLocations) {
          setLocations(location.location);
        }
      } catch (err) {
        console.error("Ошибка загрузки местоположений устройств", err);
      }
    }

    const handleAddRoom = async (parentRoom = null) => {
      const name = prompt("Введите имя новой комнаты:");
      if (name) {
        try {
          const newLocation = await createLocation(name, "description", parentRoom?.location_id);

          const newRoom = {
            location_id: newLocation?.location_id,
            name,
            description: "",
            parent_id: parentRoom?.location_id ?? null,
            depth: parentRoom ? parentRoom.depth + 1 : 0,
          };

          setLocations((prev) => [...prev, newRoom]);
        } catch (error) {
          console.error("Ошибка при создании комнаты:", error);
          alert("Не удалось создать комнату");
        }
      }
    };


        
     useEffect(() => {
        // Загружаем пользователя из localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          
        }, []);
        
  return (
    <div className="min-h-screen flex">
      {/* Sidebar занимает фиксированное пространство слева */}
      <Sidebar 
        user={user} 
        rooms={locations} 
        onAddRoom={handleAddRoom} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      />
      {/* Контент справа от боковой панели */}
      <div className={`flex-1 ${isCollapsed?"ml-20":"ml-64"}`}>
        <Header />
        <main className="pt-16 p-4 bg-gray-200 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
