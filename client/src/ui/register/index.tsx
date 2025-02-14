"use client";
import React from "react";
import { useForm} from "react-hook-form"
import { userData } from "../../../types";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/lib/api";
export default function Register() {
    const router=useRouter();
    const [signup, { isLoading }] = useSignupMutation();


  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();



  const onSubmit = async (data: userData) => {
    console.log("Submitting data:", data);
    try {
      const formData = new FormData();
      if (data.name && data.email && data.password && data.profileImage) {
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("profileImage", data.profileImage[0]);
      }
  
      const response = await signup(formData).unwrap();
      console.log("API Response:", response);
  
      reset();
      router.push("/login");
    } catch (error: unknown) {
  console.error("Signup Error:", error);

  if (error instanceof Error) {
    alert(error.message || "Registration failed");
  } else if (typeof error === "object" && error !== null) {
    alert(JSON.stringify(error)); // Log full error object if possible
  } else {
    alert("An unknown error occurred");
  }
    }
  };
  
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

      <button type="submit" disabled={isLoading} className="w-full bg-[#2222e6] text-white p-2 rounded hover:bg-[#5151dd]">
        Register
      </button>
    </form>
  );
}
