
'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?:string;
  disabled?:boolean;
  name?:string;
}

export default function PasswordInput({ id, value, onChange,placeholder,disabled,name}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
      className="w-full"
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        required
      />
      <div
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
      >
        {showPassword ? (
          <EyeOpenIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <EyeClosedIcon className="h-5 w-5 text-gray-500" />
        )}
      </div>
    </div>
  );
}
