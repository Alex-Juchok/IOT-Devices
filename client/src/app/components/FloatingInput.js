import { useState } from "react";
import { FaUser } from "react-icons/fa";

const FloatingInput = ({ icon: Icon, placeholder, type = "text", value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative flex items-center border-b-2 ${
        isFocused || value ? "border-green-400" : "border-gray-300"
      } transition-all duration-300 mb-6`}
    >
      <div className="text-gray-400 mx-3">
        <Icon />
      </div>
      <div className="relative w-full">
        <label
          className={`absolute left-2 transition-all duration-300 ${
            isFocused || value
              ? "top-[-0.8rem] text-sm text-green-400"
              : "top-[50%] translate-y-[-50%] text-gray-400 text-base"
          }`}
        >
          {placeholder}
        </label>
        <input
          type={type}
          className="w-full py-2 bg-transparent outline-none text-gray-800 dark:text-gray-200"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};

export default FloatingInput;
