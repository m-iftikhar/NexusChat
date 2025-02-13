"use client";
import React from "react";
import {useForm} from "react-hook-form"
import { userData } from "../../../types";
import { useRouter } from "next/navigation";
export default function Register() {
    const router=useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();


  const onSubmit=async(data:userData)=>{
       console.log(data,"userdata")
       router.push("/login")
  }
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block">Name</label>
        <input
        {...register("name",{required:"name is required"})}
          type="text"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        
          placeholder="user name"
        />
        {errors && errors.name && errors.name.message && <p className="text-sm text-red-600">
                         {typeof errors.name.message === "string" ? errors.name.message :"invalid input"}
          </p>}
      </div>

      <div>
        <label className="block">Email</label>
        <input
         {...register("email",{required:"email is required",pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Enter a valid email address"
      }})}
          type="email"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
         
          placeholder="email"
        />
         {errors && errors.email && errors.email.message && <p className="text-sm text-red-600">
                         {typeof errors.email.message === "string" ? errors.email.message :"invalid input"}
          </p>}
      </div>

      <div>
        <label className="block">Password</label>
        <input
        {...register("password",{required:"password is required"})}
          type="password"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
       
          placeholder="password"
        />
        {errors && errors.password && errors.password.message && <p className="text-sm text-red-600">
                         {typeof errors.password.message === "string" ? errors.password.message :"invalid input"}
          </p>}
      </div>
      <div>
        <label className="block"> Confirm Password</label>
        <input
       {...register("confirmPassword", {
        required: "Confirm password is required",
        validate: value => value === watch("password") || "Passwords do not match"
        })}
    
          type="password"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      
          placeholder="confirm password"
        />
         {errors && errors.confirmPassword && errors.confirmPassword.message && <p className="text-sm text-red-600">
                         {typeof errors.confirmPassword.message === "string" ? errors.confirmPassword.message :"invalid input"}
          </p>}
    
      </div>

      <div>
        <label className="block">Profile Picture</label>
       <input
        {...register("profileImage",{required:"profileImage is required"})}
      type="file"
      className="w-full border p-2 rounded"

     />
     {errors && errors.profileImage && errors.profileImage.message && <p className="text-sm text-red-600">
                         {typeof errors.profileImage.message === "string" ? errors.profileImage.message :"invalid input"}
          </p>}
    </div>

      <button type="submit" className="w-full bg-[#2222e6] text-white p-2 rounded hover:bg-[#5151dd]">
        Register
      </button>
    </form>
  );
}
