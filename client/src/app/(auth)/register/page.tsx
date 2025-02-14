import React from 'react'
import Register from '@/ui/register'
import Link from 'next/link'
const page = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-secondary'>
        <div className='w-full max-w-md space-y-6 p-8 shadow-lg rounded-lg bg-white'>
            
      <h1 className='text-2xl font-bold text-center text-primary'>Create Account</h1>
      <Register/>
      <p className='text-center'>
        Have an Account ?{" "}
    <Link  href={"/login"}className='text-indigo-500 hover:underline'> Sign in
    </Link>

      </p>
      </div>
      </div>

  )
}

export default page
