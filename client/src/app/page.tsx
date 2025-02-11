import Chat from "@/ui/chat";
import Sidebar from "@/ui/sidebar";
import Users from "@/ui/users";


export default function Home() {
  return (
    <div>
     <div className="p-[20px] bg-slate-200">
      <div className="flex">
      <div className="w-[20%] flex justify-center"><Sidebar/></div>
      <div className="w-[30%] h-[95vh] flex justify-center"><Users/></div>
      <div className="w-[100%] h-[95vh] flex justify-center"><Chat/></div>
     </div>
     </div>
    </div>
  );
}
