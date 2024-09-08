import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const first_name = localStorage.getItem('first_name');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="w-full bg-blue-600 flex justify-between items-center px-4 py-2">
      <div className="flex items-center">
        {token && (
          <img
            src={`https://ui-avatars.com/api/?name=${first_name}&background=ffffff&color=000000`}
            className="h-12 w-12 rounded-full"
            alt="User Avatar"
          />
        )}
      </div>
      <div className="flex gap-2">
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="text-white font-semibold px-4 py-2 rounded hover:text-gray-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-200"
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
