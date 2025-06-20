// components/widget/DigitalDisplay.js
const DigitalDisplay = ({ value, unit = "°C", label = "Temperature" }) => {
    return (
      <div className="flex font-segment flex-col items-center justify-center bg-black text-green-400 rounded-xl p-4 shadow-inner w-60">
        <div className=" font-segment text-xs uppercase tracking-wider text-gray-400 mb-2 font-mono">
          {label}
        </div>
        <div className="text-[3rem] font-segment leading-none ">
          {value}
          <span className="text-xl ml-1">{unit}</span>
        </div>
      </div>
    );
  };
  
  export default DigitalDisplay;
  