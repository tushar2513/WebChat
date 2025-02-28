import { useState } from 'react'
import { signupUser } from "../lib/utils";
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, MessageCircleCodeIcon } from 'lucide-react';
import UserIcon2 from '../icons/UserIcon2';
import MailIcon from '../icons/MailIcon';
import PasswordIcon from '../icons/PasswordIcon';
import UserIcon from '../icons/UserIcon';
import { Link, useNavigate } from 'react-router-dom';
import SignupPageIcon from '../icons/SignupPageIcon';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    username: "",
  });

  const { isSigningUp,  } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("Full name is required");
    if(!formData.username.trim()) return toast.error("Username is required");
    if(!formData.email.trim()) return toast.error("Email is required");
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if(!formData.password) return toast.error("Password is required");
    if(formData.password.length < 6) return toast.error("Password must conatin at least 6 character");

    return true;
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const success = validateForm();
    if(success === true){
      const isSuccess = await signupUser(formData);
      if(isSuccess){
        navigate('/login');
      }
    }
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className='flex flex-col justify-center items-center p-4 sm:p-10 rounded-md'>
        <div className='w-full max-w-md space-y-6 mt-6'>
          {/* logo */}
          <div className='flex flex-col justify-center items-center mb-1 sm:mb-4'>
            <div className='flex flex-col items-center sm:gap-2'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors'>
                <MessageCircleCodeIcon className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2 text-center'>Create Account</h1>
              <p className='text-sm text-center'>Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-3 flex flex-col justify-center items-center'>

            <label className="flex flex-col items-start gap-2 w-full sm:ml-16">
              Username
              <div className="relative w-full sm:w-[85%] flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon2 />
                </div>
                <input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} type="text" placeholder="username" className="text-md bg-transparent border border-gray-700 rounded-md pr-16 pl-10 py-2 outline-none focus:outline-gray-700 transition-all duration-200 w-full" />
              </div>
            </label>

            <label className="flex flex-col items-start gap-2 w-full sm:ml-16 ">
              Full Name
              <div className="relative w-full sm:w-[85%] flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon />
                </div>
                <input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} type="text" placeholder="full name" className="text-md bg-transparent border border-gray-700 rounded-md pr-16 pl-10 py-2 outline-none focus:outline-gray-700 transition-all duration-200 w-full" />
              </div>
            </label>

            <label className="flex flex-col items-start gap-2 w-full sm:ml-16">
              Email
              <div className="relative w-full sm:w-[85%] flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MailIcon />
                </div>
                <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="text" autoComplete="off" placeholder="email" className="text-md bg-transparent border border-gray-700 rounded-md pr-16 pl-10 py-2 outline-none focus:outline-gray-700 transition-all duration-200 w-full" />
              </div>
            </label>

            <label className="flex flex-col items-start gap-2 w-full sm:ml-16">
              Password
              <div className="relative w-full sm:w-[85%] flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <PasswordIcon />
                </div>
                <input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} type={showPassword ? 'text' : 'password'} placeholder='●●●●●●' className="text-md bg-transparent border border-gray-700 rounded-md pr-16 pl-10 py-2 outline-none focus:outline-gray-700 transition-all duration-200 w-full" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </div>
              </div>
            </label>

            <div className="relative w-full sm:w-[85%]">
              <button type="submit" onClick={handleSubmit} className="text-sm w-full mt-2 text-white bg-purple-500 border-purple-300 rounded-md pr-16 pl-10 py-2 outline-none focus:outline-purple-400 transition-all duration-200" disabled={isSigningUp}>
                {isSigningUp ? (
                  <div className='flex justify-center items-center gap-x-1'>
                    <Loader2 className="size-4 animate-spin" />
                    Loading...
                  </div>
                ) : ("Create Account")}
              </button>
            </div>

          </form>

          <div className='text-center text-sm'>
            <p className='text-base-content'>
              Already have an account?{" "}
              <Link to='/login' className='link link-primary'>Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/*right side */}
      <div className="hidden lg:flex flex-col h-full w-full justify-center items-center bg-primary-100 rounded-md">
        <div><SignupPageIcon /></div>
        <p className='text-4xl text-white shadow-sm font-bold mb-5'>Join our community</p>
        <p className='text-lg text-white shadow-sm '>Connect with friends and share moments and stay in touch with your loved ones.</p>
      </div>
    </div>
  )
}

export default SignupPage



{/* <label className="flex flex-col items-start gap-2">
              Full-Name
              <div className="relative w-[85%]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon2 />
                </div>
                <input type="text" placeholder="Full-Name" className="text-md bg-transparent border border-gray-700 rounded-md pl-10 py-3 outline-none focus:outline-gray-700 transition-all duration-200 w-full" />
              </div>
            </label>


            <label className="flex flex-col items-start gap-2"> Full-Name
              <div className='relative w-[85%]'>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon2 />
                </div>
                <input type="text" placeholder="Full-Name" className='text-md bg-transparent border border-gray-700 rounded-md px-4 py-3 outline-none focus:outline-gray-700 transition-all duration-200 w-[85%]' />
              </div>
            </label>

            <label className="flex flex-col items-start gap-2"> Username
              <input type="text" placeholder="username" className='text-md bg-transparent border border-gray-700 rounded-md px-4 py-3 outline-none focus:outline-gray-700 transition-all duration-200 w-[85%]' />
            </label>

            <label className="flex flex-col items-start gap-2"> Email
              <input type="email" placeholder="email" className='text-md bg-transparent border border-gray-700 rounded-md px-4 py-3 outline-none focus:outline-gray-700 transition-all duration-200 w-[85%]' />
            </label>

            <label className="flex flex-col items-start gap-2"> Password
              <input type="password" className='text-md bg-transparent border border-gray-700 rounded-md px-4 py-3 outline-none focus:outline-gray-700 transition-all duration-200 w-[85%]' />
            </label> */}