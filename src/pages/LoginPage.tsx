import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore";
import SignupPageIcon from "../icons/SignupPageIcon";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, MessageCircleCodeIcon } from "lucide-react";
import UserIcon2 from "../icons/UserIcon2";
import PasswordIcon from "../icons/PasswordIcon";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { identifier, password } = formData;

    if (!identifier || !password) {
      toast.error("Both fields are required");
      return;
    }

    //const isEmail = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    // if (isEmail(identifier)) {
    //   console.log("Logging in with email...");
    // } else {
    //   console.log("Logging in with username...");
    // }

    login(formData);
  };

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
              <h1 className='text-2xl font-bold mt-2 text-center'>Welcome Back</h1>
              <p className='text-sm text-center'>Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-3 flex flex-col justify-center items-center'>

            <label className="flex flex-col items-start gap-2 w-full sm:ml-16">
              Username / Email
              <div className="relative w-full sm:w-[85%] flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon2 />
                </div>
                <input value={formData.identifier} onChange={(e) => setFormData({ ...formData, identifier: e.target.value })} type="text" placeholder="username / email" className="text-md bg-transparent border border-gray-700 rounded-md pr-16 pl-10 py-2 outline-none focus:outline-gray-700 transition-all duration-200 w-full" />
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
              <button type="submit" onClick={handleSubmit} className="text-sm w-full mt-2 text-white bg-purple-500 border-purple-300 rounded-md pr-16 pl-10 py-2 outline-none focus:outline-purple-400 transition-all duration-200" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <div className='flex justify-center items-center gap-x-1'>
                    <Loader2 className="size-4 animate-spin" />
                    Loading...
                  </div>
                ) : ("Sign in")}
              </button>
            </div>

          </form>

          <div className='text-center text-sm'>
            <p className='text-base-content'>
              Dont have an account?{" "}
              <Link to='/signup' className='link link-primary'>Sign up</Link>
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

export default LoginPage