import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'
import TaskList from '../components/TaskList'

const Tasks = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header />
      <main className="py-[50px]">
        <TaskList />
      </main>
    </div>
  )
}

export default Tasks