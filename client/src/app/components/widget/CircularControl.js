// import { Arc, Knob, Pointer, Value } from 'rc-knob';
// import { useState } from 'react';

// const TemperatureKnob = () => {
//   const [temp, setTemp] = useState(22);

//   return (
//     <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-xl shadow-lg">
//       <Knob
//         size={180}
//         angleOffset={220}
//         angleRange={280}
//         min={-20}
//         max={50}
//         value={temp}
//         onChange={(val) => setTemp(Math.round(val))}
//       >
//         <Arc arcWidth={6} color="#60a5fa" radius={90} />
//         <Pointer width={6} radius={81} type="circle" color="#3b82f6" />
//         <Value
//           marginBottom={10}
//           className="text-4xl text-white"
//           color="white"
//         >
//           {temp}°C
//         </Value>
//       </Knob>
//       <p className="text-white text-sm mt-4 uppercase tracking-wider">
//         Thermostat
//       </p>
//     </div>
//   );
// };

// export default TemperatureKnob;
