export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Scout Databank <span className="text-primary">v2.5</span>
            </h1>
            <span className="ml-4 text-sm text-gray-500">
              AI-Powered Philippine Retail Analytics
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Export
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Settings
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}