'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../store/slices/authSlice'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const dispatch = useDispatch()

  const authMutation = useMutation({
    mutationFn: async (userData: {
      email: string
      password: string
      name?: string
    }) => {
      const endpoint =
        mode === 'signin' ? '/api/auth/signin' : '/api/auth/signup'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Authentication failed')
      }

      return response.json()
    },
    onMutate: () => {
      dispatch(loginStart())
    },
    onSuccess: (data) => {
      dispatch(
        loginSuccess({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name,
        })
      )
    },
    onError: (error: Error) => {
      dispatch(loginFailure(error.message))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    authMutation.mutate({
      email,
      password,
      ...(mode === 'signup' && { name }),
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-w-md mx-auto'>
      {/* <h2 className='text-2xl font-bold text-center'>
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </h2> */}

      {mode === 'signup' && (
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full p-2 border rounded'
        />
      )}

      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className='w-full p-2 border rounded'
      />

      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className='w-full p-2 border rounded'
      />

      <button
        type='submit'
        disabled={authMutation.isPending}
        className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50'
      >
        {authMutation.isPending
          ? 'Loading...'
          : mode === 'signin'
            ? 'Sign In'
            : 'Sign Up'}
      </button>

      {authMutation.error && (
        <p className='text-red-500 text-sm text-center'>
          {authMutation.error.message}
        </p>
      )}
    </form>
  )
}
