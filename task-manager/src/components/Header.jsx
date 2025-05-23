import { useAuth } from '../hooks/useAuth'


const Header = () => {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <header className="pt-[50px]">
      <div className=" px-[40px]  sm:px-[80px] lg:px-[100px] flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-auto"
              src="/Logo.png"
              alt="Workflow"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-500">
              {user.username}
            </span>
          <button
            onClick={logout}
            title="Logout"
          >
            {user.role === 'admin' ? (
              <img src="/admin.png" alt="admin" className="w-[45px] rounded-full" />
            ) : (
              <img src="/user.png" alt="user" className="w-[45px]  rounded-full" />
            )}

          </button>
        </div>
      </div>
    </header>
  )
}

export default Header