import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-brown-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brown-500 mb-2">Object detection System</h1>
          <p className="text-gray-400">Secure login required to access the system</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

