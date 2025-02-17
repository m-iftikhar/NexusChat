import React from 'react'
import Image from 'next/image'


const Chat = ({chatUser}) => {
  

  return (
    <div className='w-[90%] h-[80vh] rounded-lg shadow-md shadow-[#79c5ef]'>
      <div className='flex items-center bg-gray-100 border-b border-gray-300 p-4'>
        <div>
          {chatUser?.profileImage ? (
          <Image
                        src={chatUser?.profileImage.trim() || "/fallback.jpg"}
                        alt={chatUser?.name}
                        width={40}
                        height={40}
                        className="rounded-full w-12 h-12 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-600 text-white font-bold rounded-full">
                        {chatUser?.name.charAt(0).toUpperCase()}
                      </div>
                    )}
        </div>
        <div className='ml-3'>
        <h2 className='text-lg font-semibold text-gray-800'>
                 {chatUser?.name}
        </h2>
        {/* <p className='text-sm text-gray-500'>
          Typing....
        </p> */}
        </div>
      </div>
      <div className='flex flex-col h-full  bg-white'>
        <div className='flex-1 overflow-auto p-4 space-y-4'>
          <div className='flex justify-end'>
          <div className='bg-blue-500 p-3 text-white rounded-lg max-xs relative'> Hi Chat</div>
          </div>
        </div>
        <div className='p-4 bg-white shadow-lg rounded-md'>
          <div className='bg-white p-2 rounded-md border border-gray-400'>
            <form className='flex items-center'>
             <input className='flex-1 focus:outline-none'/>
             <button type="button" className='ml-2 bg-[#2222e6] hover:bg-[#6363cc] text-white px-4 py-2 rounded-lg'>
          Send
        </button>
            </form>
          </div>

        </div>
      </div>
      
    </div>
  )
}

export default Chat
