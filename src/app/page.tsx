import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0a0a0a'
    }}>
      <Sidebar />
      <ChatArea />
      
      {/* Chat area - we'll build this next
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#444444',
        fontSize: '16px'
      }}>
        Select a chat or start a new one
      </div> */}
    </div>
  )
}