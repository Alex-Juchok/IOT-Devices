import { FiThermometer } from "react-icons/fi";

const AnalogGauge = ({ value, min = -20, max = 50 }) => {
        const percentage = (value - min) / (max - min);
        const rotation = -90 + percentage * 180;
      
        const generateTicks = () => {
            const ticks = [];
            for (let i = min; i <= max; i += 8) {
              const angleDeg = -171 + ((i - min) / (max - min)) * 180;
              const angle = angleDeg * (Math.PI / 180);

              const x1 = 100 + Math.cos(angle) * 80;
              const y1 = 100 + Math.sin(angle) * 80;
              const x2 = 100 + Math.cos(angle) * 90;
              const y2 = 100 + Math.sin(angle) * 90;
          
              // Координаты текста чуть дальше тика
              const labelX = 100 + Math.cos(angle) * 100;
              const labelY = 100 + Math.sin(angle) * 100;
          
              ticks.push(
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#ccc"
                    strokeWidth="2"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    fontSize="10"
                    fill="#ccc"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {i+4}°
                  </text>
                </g>
              );
            }
            return ticks;
          };
          
      
        return (
          <div className="relative w-48 h-32 mx-auto ">
            <svg width="100%" height="100%" viewBox="0 0 200 120">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
      
              {/* Полукруг */}
              <path
                d="M10,100 A90,90 0 0,1 190,100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="10"
              />
      
              {/* Вертикальные и горизонтальные шкалы */}
              {generateTicks()}
      
              {/* Метки по краям */}
              <text x="15" y="110" fontSize="14" fill="#ccc">{min}°</text>
              <text x="160" y="110" fontSize="14" fill="#ccc">{max}°</text>
            </svg>
      
            {/* Стрелка */}
            <div
              className="absolute bottom-5 left-1/2 origin-bottom"
              style={{
                width: "2px",
                height: "85px",
                backgroundColor: "#f87171",
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                transition: "transform 0.5s ease",
              }}
            ></div>
      
            {/* Значение */}
            <div className="absolute bg-gray-700 text-white px-2 py-1 text-sm rounded-xl left-1/2 transform -translate-x-1/2 bottom-[-30px]">
              {value} °C
            </div>
      
            {/* Иконка */}
            <div className="absolute left-1/2 top-[52%] transform -translate-x-1/2 -translate-y-1/2 text-white">
              <FiThermometer size={24} />
            </div>
          </div>
        );
      };


export default AnalogGauge
