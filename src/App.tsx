import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from '@/pages/Dashboard'
import { Search } from '@/pages/Search'
import { Companies } from '@/pages/Companies'
import { Contacts } from '@/pages/Contacts'
import { Analytics } from '@/pages/Analytics'
import { blink } from '@/blink/client'
import { Toaster } from '@/components/ui/toaster'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading SMARTR CRM...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">SMARTR CRM</h1>
          <p className="text-gray-600 mb-8">
            Automate your lead generation by searching job platforms and identifying companies with open positions.
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="text-gray-700 mb-4">Please sign in to access your CRM dashboard</p>
            <button
              onClick={() => blink.auth.login()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'search':
        return <Search />
      case 'companies':
        return <Companies />
      case 'contacts':
        return <Contacts />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default App