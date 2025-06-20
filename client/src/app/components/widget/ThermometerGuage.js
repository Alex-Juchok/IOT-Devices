import React from "react";
import Thermometer from "react-thermometer-component";

const Temp = ({ value, title, theme="light" }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6 rounded-xl w-fit mx-auto">
      <Thermometer
        theme={theme}
        value={value}
        max={70}
        min={-20}
        steps="1"
        format="°C"
        size="normal"
        height={200}
      />
      <div className="text-black dark:text-white text-lg font-medium mt-4">
        {value}°C
      </div>
    </div>
  );
};

export default Temp;
