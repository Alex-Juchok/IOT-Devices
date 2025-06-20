import React from "react";
import Image from "next/image";
import GaugeBg from "../../images/gauge-bg.png";

const gaugeBarsNb = 10;
const gaugeBarMargin = 1;
const lowBattery = 25;

const Battery = ({ value }) => {
  const percent10 = Math.round(value / gaugeBarsNb);
  const percentageArray = [...Array(percent10).keys()];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[170px] h-[50px]">
        <Image
          src={GaugeBg}
          alt="BatteryBG"
          className="absolute w-full h-full left-0 top-0 z-0"
        />
        <div className="flex flex-row items-center ml-[3px] h-full relative">
          {percentageArray.map((_, index) => (
            <div
              key={index}
              className={`mx-[1px] h-[40px] ${
                index === 0
                  ? "rounded-l-[10px]"
                  : index === gaugeBarsNb - 1
                  ? "rounded-r-[10px]"
                  : ""
              } w-[13.9px] ${value < lowBattery ? 
                "bg-red-500" : "bg-[#3f5c8c]"}`} 
            ></div>
          ))}
        </div>
      </div>
      <div className="mt-2 text-sm">
        Battery -
        <span className={value < lowBattery ? "text-red-500" : "text-green-500"}>
          {" "}
          {value}%
        </span>
      </div>
    </div>
  );
};

export default Battery;
