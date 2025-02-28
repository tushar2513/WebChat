import { LogOut, MessageCircleCodeIcon, Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center gap-8'>
            <Link to='/' className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
              <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                <MessageCircleCodeIcon className='w-5 h-5 text-primary' />
              </div>
              <h1 className='text-lg font-bold'>WebChat</h1>
            </Link>
          </div>

          <div className='flex items-center gap-2'>
            <Link to={'/settings'} className={`btn btn-sm gao-2 transition-colors`}>
              <Settings className='w-4 h-4' />
              <span className='hidden sm:inline'>Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={'/profile'} className={`btn btn-sm gap-2`}>
                  <User className='size-5' />
                  <span className='hidden sm:inline'>Profile</span>
                </Link>

                <button className='flex gap-2 items-center' onClick={handleLogout}>
                  <LogOut className='size-5' />
                  <span className='hidden sm:inline'>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar