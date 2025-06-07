import React, { useState, useContext } from 'react'
import { Link, useNavigate } from "react-router";
import { toast } from 'sonner';

//component
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'

//utils
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axioslnstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
//context
import { UserContext } from '../../context/userContext';




const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInvateToken] = useState('');
  const [profilePic, setProfilePic] = useState(null);


  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = '';

    if (!email && !password && !fullName) {
      return toast.warning("Please enter complate information!")
    }
    if (!email) {
      return toast.warning("Please enter the email")
    }
    if (!password) {
      return toast.warning("Please enter the password")
    }
    if (!fullName) {
      return toast.warning("Please enter the fullname")
    } if (!validateEmail(email)) {
      return toast.warning("Please enter a valid email address")
    }

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";


      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        adminInviteToken,
        profileImageUrl
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
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="John"
              type='text'
            />
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

            <Input
              label="Admin Invaite Token"
              type="password"
              value={adminInviteToken}
              onChange={(e) => setAdminInvateToken(e.target.value)}
              placeholder="6 Digit Code"
            />
          </div>

          <button type='submit' className='btn-primary'>Sign up</button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already an account? {" "}
            <Link className='font-medium text-[#d29901]' to="/login">Login</Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
