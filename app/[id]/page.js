"use client"
import Link from 'next/link';
import Button from '@/components/page1';
import React, { useEffect, useRef, useState ,useCallback } from 'react';

import { io } from 'socket.io-client';
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000');
let  userId 
function MessengerContent() { 
 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const [contacts, setContacts] = useState([]);
 

  const sendid = ()=>{
    const pathArray = window.location.pathname.split('/');
const id = pathArray[pathArray.length - 1];
   
    userId =  id
    
    socket.emit('send-id',(id))
  }

  const getContacts = async ()=>{
   
    /* const obj = { userId:'67d856b8236cd2bf5d141b1a' ,otherUserId:'67ae617c61c9bc5ab660e17b',page:1}
     socket.emit('request-private-history',(obj)); */
     const contect_req = await fetch(`http://localhost:5000/API/contects?id=${'67d856b8236cd2bf5d141b1a'}`)
     const cont   = await contect_req.json()
   
     setContacts(cont.contects)
   }
  useEffect(() => {
   
sendid()
getContacts()
    // Connection handler
    const handleConnect = () => {
     
      setStatus(`Connected (ID: ${1})`);
   
      socket.emit('request-private-history');
    
      socket.emit('request-history');
    };

    // History handler
    const handleHistory = (history) => {
      
      setMessages(history);
       // Reverse to show newest last
    };

    // Message handler
    const handleNewMessage = (msg) => {
     
      setMessages(prev => [...prev, msg]);
    };

    // Setup listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', () => setStatus('Disconnected'));
    socket.on('message-history', handleHistory);
    socket.on('new-message', handleNewMessage);
    socket.on('private-message-history', async(history)=>{
      setMessages(history)
      
  
    })
    socket.on('force-message-history',()=>{
      const obj = { userId:'67d856b8236cd2bf5d141b1a' ,otherUserId:'67ae617c61c9bc5ab660e17b',page:1}
      socket.emit('request-private-history',(obj)); 
  
    })
     socket.on('new-private-message',(msg)=>{
     console.log('message : ' )
     setMessages(prev => [...prev, msg]);
     })
    
    //socket.emit('request-history');
  
    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect');
      socket.off('message-history', handleHistory);
      socket.off('new-message', handleNewMessage);
      socket.off('private-message-history')
      socket.off('new-private-message')
    };
    
  },[0]);
  





  const sendMessage = () => {
    const pathArray = window.location.pathname.split('/');

    const id = pathArray[pathArray.length - 1];
    if (input.trim()) {
      socket.emit('send-message', { text: input , senderID :id });
      setInput('');
    }
  };
  const sendPrivetMassage=(text,senderID,recipientId)=>{
    if(input.trim()!=''){ 
      
      
      senderID = window.location.pathname.split('/')[1]
let data = {text,senderID,recipientId:'67ae617c61c9bc5ab660e17b'}

    socket.emit('send-private-message',(data))
    setInput('');
    console.log('kiki')
  } else{
    console.log('jiji')
  }
  }
  

  return(  <div className='massenger-content'>
    <div className='contect_side'>

{contacts.map((cont)=>{
 
 const pathArray = window.location.pathname.split('/');

   const userId = pathArray[pathArray.length - 1];
   
   return(

    <div key={cont}
     className='contect_unit'>
    <div className='profile'><img  src='http://localhost:5000/getpic'/></div>
    <div className='contect_name'><p>Dr.Maatalah</p></div>
    </div>
)})}

    </div>
    <div className='chat_side'>


   {messages.map( (msg)=>{
 
 const pathArray = window.location.pathname.split('/');

   const userId = pathArray[pathArray.length - 1];
   
   return(

   <div key={msg._id} className={`${msg.sender === userId
    ? 'massege_div' : 'recive_massege_div'}`}>
<p className='massege'>
{msg.text}
 </p>
</div>
)})}


<div className='send_message_part'>
<input
         value={input}
         onChange={(e) => setInput(e.target.value)}
         onKeyPress={(e) => e.key === 'Enter' && sendPrivetMassage(input,userId,"hhh")}
         placeholder="Type a message..."
       />
 <button onClick={()=>{sendPrivetMassage(input,userId,"hhh")}}>SEND</button>
</div>

    </div>

   </div>)
}
  
  function YourProject  (){ 
    
    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState("");
    const handleClick = () => {
      fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setFileName(file.name); 
      }
    };
    
    
    return(
     <div className='project_main_window'>

<div className='project_side1'>
<div className='project_title'>
  <p className='p_title'>Project Title:</p>
  <p>Web site for finel study projects.</p>
</div>
<div className='project_discreption'>
<div>  <p className='p_title'>Type of System :</p><p>.WebSite</p> </div>
<div>  <p className='p_title'>System functionalty:</p><p>.Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department.</p> </div>
<div>  <p className='p_title'>Team of work:</p><p>.Isslam hassaine</p> <p>.Zimo mongol</p></div>
</div>
<div className='project_uplaod_space'>
  <input
        type="file"
        webkitdirectory="true"
        // @ts-ignore - mozdirectory for Firefox
        mozdirectory="true"
        directory="true"
        ref={fileInputRef}
       onChange={handleFileChange}
      />

       <button
        onClick={handleClick}
        className="Upload_button"
      >
        <img src='icons8-upload-24.png'/>
      </button>
      <div><p className='file_name'>{fileName}</p></div>

</div> <div className='project_options_buttons'>
  <button >Submit</button>
  <button>Add Draft</button>
  </div>
  </div>
<div className='project_side2'>
  <div className='p_title'>Under Supervision :</div>
  <div className='profile'><img  src='http://localhost:5000/getpic'/></div>
  <div><p>Dr.Maatalah</p></div>
  </div>

    
    
     </div>
  )}

 function DraftContent (){
  const handleDownload = async () => {
 
    const response = await fetch('https://api.example.com/data');
    const blob = await response.blob();
    
   
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv'; 
    document.body.appendChild(link);
    link.click();
    
   
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  const handelOpenMenus=(id)=>{

    setIsActiveMenu(activeMenu === id ? null : id);
    
  }
const [activeMenu,setIsActiveMenu] = useState(null)
const menus = [
  { id: '1', title: 'Notifications', content: 'Notification list...' },
  { id: '2', title: 'Messages', content: 'Message inbox...' },
  { id: '3', title: 'Settings', content: 'Settings panel...' }
];

  return(

    <div className='drafts_main'>
   {menus.map(menu => (
  <div
    id={`menu-${menu.id}`}
    className={`BROWS_proect_menu ${activeMenu === menu.id ? 'active' : ''}`}
    key={menu.id}
  >



   <div className='Supervision_profile'> 
   <div className='p_title'> Supervision :</div>
  <div className='profile'><img  src='http://localhost:5000/getpic'/></div>
  <div><p>Dr.Maatalah</p></div>
   </div>
   <div><p>project objective:</p></div>
<div className='Brows_project_info_describe'> .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
  </div>
  <div><p>System type : app</p></div>
<div className='BROWS_proect_menu_button'>
 <button> Send Requast</button>
 </div>
  </div>
))}

       
       {menus.map((menu)=>(

<button onClick={()=>handelOpenMenus(menu.id)} key={menu.id} className='draft_unit'>
<img src='icons8-file-50.png'/>
<div  className='draft_info'>  <div><p>Draft Number:{menu.id}</p></div>
 <div><p>Uploaded in : 20/09/2025</p></div>
 </div>




</button>

       ))}





      
       
        
         

    </div>


  )
}
function BrowsProjectsContent(){
  
  
  
  
  
  
  
  
  
  
  const handelOpenMenus=(id)=>{

    setIsActiveMenu(activeMenu === id ? null : id);
    
  }
const [activeMenu,setIsActiveMenu] = useState(null)
const menus = [
  { id: '41',  content: 'Notification list...' },
  { id: '26',  content: 'Message inbox...' },
  { id: '356', content: ' Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department.' }
  ,{ id: '744',  content: 'Notification list...' }, { id: '1',  content: 'Notification list...' },
  { id: '2',  content: 'Message inbox...' },
  { id: '3', content: ' Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department.' }
  ,{ id: '7',  content: 'Notification list...' },
  { id: '6',  content: 'Message inbox...' },
  { id: '5', content: ' Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department.' }
  ,{ id: '27',  content: 'Notification list...' },
  { id: '64',  content: 'Message inbox...' },
  { id: '65', content: ' Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department.' }
];








return(

<div className='Brows_parent'>


{menus.map((menu)=>(
   <div
   key={menu.id}
   className='unit_parent'>
  <div key={menu.id} onClick={()=>handelOpenMenus(menu.id)} className='project_unit'>
  <img src='icons8-smartphone-50.png'/>
<div className='Brows_project_infos'>
  <p>Project Supervision: Dr.Maatalah</p>
<p>Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
  
  </p></div>

  

</div>
<div id={`menu-${menu.id}`}
    className={`BROWS_under_menu ${activeMenu === menu.id ? 'active' : ''}`}
    >
      <div className='project_under_menu'> 
        <div className='box'>
        <div className='p_title'> Supervision :</div>
          <div className='profile'><img  src='http://localhost:5000/getpic'/></div>
      <div><p>Dr.Maatalah</p></div>
      </div>
      <div className='box2' >
        <div className='box3'>
        <p className='box_title'>Project objective :</p>
        <div className='Brows_project_info_describe'>
        
   <p>.Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
Project objective : .Your system is designed to facilitate the submission, assignment, and management of end-of-study project themes within a Computer Science department. 
  </p>
  </div></div>
  <div className='BROWS_proect_menu_button'>
<div> <div>
 <p className='box_title'>System type:</p>
 <p >. app</p>

 </div> <div>

 <p className='box_title'>Project objective :</p>
 </div>
  </div>
 <button> Send Requast</button>
 </div>
  </div>
  
 </div>
 
   

  </div>

</div>
))}





</div>

)

}
function SuggestionContent(){




  return(
<div className='SuggestionContentParent'>

<div className='suggestion_paper1'>
<div className='suggestion_paper'>
<div>
  <p className='p_title'>The Project Name:</p>
  <input type='text'/>
</div>

</div>
<div className='suggestion_paper'>
<div>
  <p className='p_title'>The Project members:</p>
  <p className=''>member 1:</p>
  <input className='' type='text'/>
  <p className=''>member 2:</p>
  <input className='' type='text'/>
  <p className=''>member 3:</p>
  <input className='' type='text'/>
</div>

</div>
</div>
<div className='suggestion_paper1'>
<div className='suggestion_paper2'>

<p className='p_title'>The Project objective:</p>
  <textarea  onChange={(e)=>{
    console.log(e.target.value)
  }} className='objective_input' type='text'/>


</div>
</div>
<div className='suggestion_paper1'>
<div className='suggestion_paper'>
<div>
<p className='p_title'>The Project Supervision:</p>
  <input className='' type='text'/>
</div>

</div>
<div className='suggestion_paper'>
<div>
  <p className='p_title'>The Project members:</p>
  <p className=''>member 1:</p>
  <input className='' type='text'/>
  <p className=''>member 2:</p>
  <input className='' type='text'/>
  <p className=''>member 3:</p>
  <input className='' type='text'/>
</div>

</div>
</div>
</div>
  )
}
  const HomeContent = () =>{
    const [isOpen, setIsOpen] = useState(false);
    const [projectContent, setprojectContent] = useState(null);
    const [isOpen2, setIsOpen2] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleDropdownn = ()=>  setIsOpen2(!isOpen2);

    return (
    
      <div className='project-window-content'>
     <div className='projects_infos'>
  
     <button onClick={toggleDropdown}
        > <img src='image.png'/>Your Project</button>
     {isOpen &&
     
    ( <div className='menu'>
     <button onClick={()=>{setprojectContent(<YourProject/>)}}>Submition</button>
     <button onClick={()=>{setprojectContent(<DraftContent/>)}}>Drafts</button>
     </div>)
     }
  <button onClick={toggleDropdownn}><img src='image.png'/>Brows Projects</button>
  {isOpen2 &&
     
     ( <div className='menu'>
      <button onClick={()=>{setprojectContent(<BrowsProjectsContent/>)}}>Proposed projects</button>
      <button onClick={()=>{setprojectContent(<SuggestionContent/>)}}>Your  suggestion </button>
      </div>)
      }
     </div>
     {projectContent}
      </div>
    );
  }
  

export default function Home(){



  const [selectedContent, setSelectedContent] = useState(<HomeContent/>);
  const [status, setStatus] = useState('Connecting...');
  const [contacts, setContacts] = useState([]);
  const userId = useRef('')
  const [mesCcont, setContactsMesg] = useState([]);

  const sendid = ()=>{
      const token = localStorage.getItem('token');
      console.log(token)
    if (!token)// window.location.href = '/login';
    userId.current = token
  
    socket.emit('send-id',{token})
   // getContact(id)
  }

async function getContact(id,newId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/login';
   
  
    const response = await fetch(`http://localhost:5000/API/contacts-with-messages`,{
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
console.log(data)

    const contacts = data.contectstokens ;
    const messagesMap = data.messages

    setContacts(contacts);
    setContactsMesg(messagesMap);
  } catch  { 

    console.log('Failed to fetch:');
   
  }
}


 

  useEffect( () => {
     
    sendid()
    

    
        // Connection handler
        const handleConnect = () => {
         
          setStatus(`Connected (ID: ${1})`);
       
          socket.emit('request-private-history');
        
         
        };
    
        // History handler
        const handleHistory = (history) => {
          
          setMessages(history);
           // Reverse to show newest last
        };
    
        // Message handler
        const handleNewMessage = (msg) => {
         
          setMessages(prev => [...prev, msg]);
        };
    
        // Setup listeners
        socket.on('connect', handleConnect);
        socket.on('disconnect', () => setStatus('Disconnected'));
        socket.on('message-history', handleHistory);
        socket.on('new-message', handleNewMessage);
        socket.on('your-id',(data)=>{
          
         userId.current = localStorage.getItem('token')
         /*  if(data.ROLE !== 'Student'){
            localStorage.removeItem('token')
            window.location.href='/login'
          }*/
        
          getContact(userId.current,data.newId)
        })
        

        
      },[]);








  function MessengerContent() { 

let lsatmsg=''

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
   // const [sendto, setsendto] = useState('');
const sendto = useRef('')

const handleNewPrivateMessage = useCallback((msg) => {
console.log('reseved msg')
console.log(msg)

const openedChat = contacts.find((o)=>{if(o.hashedContactId === sendto.current){return o.recipientName} }).recipientName
//stoped here
mesCcont.forEach(async(m)=>{
console.log(msg)
  if(msg.sender == m.contactId || msg.recipientId == m.recipientName ){
    console.log('foooo')
m.messages.push(msg)
  }
  if(msg.recipientId === openedChat || msg.sender ==='me'){
console.log('here')


setMessages(prv=>[...prv,msg])

  }
})
});






   useEffect(()=>{
 
    socket.on('new-private-message', handleNewPrivateMessage);
   
    socket.on('private-message-history', async(history)=>{
    console.log(history)
      setMessages(history)
      
  
    
    })
  
   
    
 
    return () => {
      socket.off('new-private-message', handleNewPrivateMessage);
      socket.off('private-message-history')
     
    };
   },[])




function changeChatContent(cont){
 const contectName =  contacts.find((o)=>{if(o.hashedContactId === cont){return o.recipientName} }).recipientName


  mesCcont.forEach((msg)=>{ 

  
    if (msg.recipientName === contectName) {
     
      setMessages(msg.messages)


}})}

  
  
  
    const sendMessage = () => {
      const pathArray = window.location.pathname.split('/');
  
      const id = pathArray[pathArray.length - 1];
      if (input.trim()) {
        socket.emit('send-message', { text: input , senderID :id });
        setInput('');
      }
    };
    const sendPrivetMassage=(text,senderID,recipientId)=>{
      if(input.trim()!=''){ 
  const token = recipientId
       console.log(token)
  let data = {text,senderID,token}
  
      socket.emit('send-private-message',data)
      setInput('');
    
    } else{
     
    }
    }
    
  
    return  (  <div className='massenger-content'>
      <div className='contect_side'>
  
  {contacts.map((cont)=>{
   
  const pathArray = window.location.pathname.split('/');
  const id = pathArray[pathArray.length - 1];
  
  
     
     return(
  
      <button key={cont.hashedContactId}
       className='contect_unit'
       onClick={()=>{
    sendto.current = cont.hashedContactId
  
        changeChatContent(sendto.current)
       }}>
      <div className='profile'><img  src='http://localhost:5000/getpic'/></div>
      <div className='contect_name'><p>Dr.Maatalah</p></div>
      </button>
  )})}
  
      </div>
      <div className='chat_side'>
<div className='messages_part'> 
   {messages.map( (msg)=>{


if(lsatmsg != msg._id){
  
  lsatmsg = msg._id
  return(

<div key={msg._id} className={`${msg.sender === 'you'||'me'
 ? 'massege_div' : 'recive_massege_div'}`}>
<p className='massege'>
{msg.text}
</p>
</div>
)}


})}</div>

    


<div className='send_message_part'>
<textarea
 rows="1" 
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && sendPrivetMassage(input,userId.current,sendto.current)}
      placeholder="Type a message..."
    ></textarea>
<button onClick={()=>{sendPrivetMassage(input,userId.current,sendto.current)}}>SEND</button>
</div>

 </div>
  
     </div>)
  }
  















 async function clc(){

  const res = await fetch('http://localhost:5000/getpic')
 
     let data = await res.blob()
   
    let url = URL.createObjectURL(data)
  


  }

  return (
   
  <div className='body'>

<div className='main-header'>
<div className='profileparent'>
        <div className='profile'><img  src='http://localhost:5000/getpic'/></div>
      </div>
<div className='Logo'><img src='Adobe Express - file.png'/></div>



  
</div>



<div className='ALL'>
  <div className='header'>

     
     
    
     <div className='leftside'>
     <button className='chat_icon' onClick={() => setSelectedContent(<HomeContent/>)}>
            <img src='home.png' alt="Messenger" />
          </button>
      <button className='chat_icon' onClick={() => setSelectedContent(<MessengerContent />)}>
            <img src='facebook-messenger-logo.png' alt="Messenger" />
          </button>
          <button className='chat_icon' onClick={() => setSelectedContent(<Button />)}>
            <img src='envelope.png' alt="Messenger" />
          </button>
   </div>

</div>
   <div className='main'>
   
{selectedContent}

   </div>


</div>





  </div>
     
    
  )
}


