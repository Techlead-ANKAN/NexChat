import React from 'react';
import { useChatStore } from '../../store/useChatStore';
import ChatContainer from '../../components/ChatContainer';
import NoChatSelected from '../../components/NoChatSelected';
import Sidebar from '../../components/Sidebar';
import "./Home.css";

function Home() {
  const { selectedUser } = useChatStore();
  
  return (
    <div className="home-container">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      
      <div className="main-content">
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  );
}

export default Home;