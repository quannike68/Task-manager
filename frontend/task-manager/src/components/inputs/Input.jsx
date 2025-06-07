import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
const Input = ({ value, onChange, label, placeholder, type = "text" }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const inputType = isPassword && showPassword ? 'text' : type
    return (
        <div>
            <label className='text-[13px] text-slate-800 '>{label}</label>

            <div className='relative  input-box'>
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className='w-full bg-transparent outline-none '
                />

                {isPassword && (
                    <button
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-800 mx-2"
                    >
                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input