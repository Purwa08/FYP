import { FaSearch } from 'react-icons/fa';
import { Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from './VNIT_logo1.png';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
      <Link to="/" className="flex items-center gap-2">
          <img
            src={logo} // Logo image location
            alt="Logo"
            className="h-20 w-20 object-contain"
          />
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Attend</span>
            <span className='text-slate-700'>ify</span>
          </h1>
        </Link>
        <form
          className='bg-slate-100 p-3 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              About
            </li>
          </Link>
          <Link to='/profile'>
          {/* <li className=' text-slate-700 hover:underline'> Sign in</li> */}
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className=' text-slate-700 hover:underline'> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}