import React, { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router";
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import { toast } from 'sonner';
import axiosInstance from '../../utils/axioslnstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
const login = () => {
  const [email, setEmail] = useState('Mike91@gmail.com');
  const [password, setPassword] = useState('123456');

  const { updateUser } = useContext(UserContext)

  const navigate = useNavigate();

  //Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email && !password) {
      return toast.warning("Please enter complate information!")
    }
    if (!validateEmail(email)) {
      return toast.warning("Please enter a valid email address")
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      })
      const { token, role } = response.data;

      if (token) {
        // localStorage.setItem("token", token);
        updateUser(response.data)
        if (role == 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard')
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        return toast.error(error.response.data.message)
      } else {
        return toast.error('Somthing went wrong. Please try again.')
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full pt-16 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>
          Welcome Back
        </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            label="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />

          <button type='submit' className='btn-primary'>Login</button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have account? {" "}
            <Link className='font-medium text-[#d29901]' to="/signup">SignUp</Link>
          </p>
        </form>


      </div>
    </AuthLayout>
  )
}

export default login
