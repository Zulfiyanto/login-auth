'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { logout } from '../store/slices/authSlice'
import Link from 'next/link'

export default function HomePage() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  )
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    dispatch(logout())
  }

  if (isAuthenticated) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold mb-4'>
          Welcome, {user?.name || user?.email}!
        </h1>
        <button
          onClick={handleLogout}
          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center space-y-4'>
      <h1 className='text-3xl font-bold'>Welcome to Our App</h1>
      <div className='space-x-4'>
        <Link
          href='/signin'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Sign In
        </Link>
        <Link
          href='/signup'
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
