"use client";
import { useLoginMutation } from "@/lib/api";
import { useRouter } from "next/navigation";
import {useForm} from "react-hook-form";
import { userData } from "../../../types";
import { useDispatch} from "react-redux";
import { setUser } from "@/lib/features/userslice";
export default function Login() {
 
    const [login, { isLoading }] = useLoginMutation();
     const dispatch=useDispatch();
     const router=useRouter();
     const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm();

      const onSubmit = async (data: userData) => {
        try {
          
          const result=await login(data).unwrap();
          localStorage.setItem("token",result.token);
          
          dispatch(setUser(result.user));
          reset();
          router.push("/");
          
          
        }catch (error: unknown) {
          console.error("login Error:", error);
        
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
     

      <button type="submit" disabled={isLoading} className="w-full bg-[#2222e6] text-white p-2 rounded hover:bg-[#4747cf]">
        Login in
      </button>
    </form>
  );
}
