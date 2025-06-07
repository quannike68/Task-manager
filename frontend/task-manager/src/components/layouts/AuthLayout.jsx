import React from "react";
import UI_IMG from '../../assets/Wellcome.png'
const AuthLayout = ({ children }) => {
    return <div className="flex justify-between">
        <div className="w-screen h-screnn md:w-[120vh] px-12 pt-8 pb-12" >
            <h1 className="text-2xl font-bold">Task Manager</h1>
            {children}
        </div>

        <div className="hidden md:flex w-full h-screen items-center justify-center ">
            <img src={UI_IMG} className="" />
        </div>
    </div>
}


export default AuthLayout; 