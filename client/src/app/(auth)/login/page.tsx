import React from 'react'
import Login from '@/ui/login'
import Link from 'next/link'
const page = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-secondary'>
        <div className='w-full max-w-md space-y-6 p-8 shadow-lg rounded-lg bg-white'>
            <div className=''>
      <h1 className='text-2xl font-bold text-center text-primary'>Create Account</h1>
      <Login/>
      <p className='text-center mt-4'>
        Don&apos;t Have an Account ?{" "}
    <Link href={"/register"} className='text-indigo-500 hover:underline'> Register
    </Link>
  </p>
      </div>
      </div>
    </div>
  )
}

export default page
