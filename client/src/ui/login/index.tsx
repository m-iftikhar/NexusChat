"use client";

export default function Login() {


  return (
    <form className="space-y-4">
    

      <div>
        <label className="block">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
    
    
          placeholder="email"
        />
      </div>

      <div>
        <label className="block">Password</label>
        <input
          type="password"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          
        
          placeholder="password"
        />
      </div>
     

      <button type="submit" className="w-full bg-[#2222e6] text-white p-2 rounded hover:bg-[#4747cf]">
        Login in
      </button>
    </form>
  );
}
