import { useRef, useState } from "react";

export default function Login() {
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = userNameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Plese Insert all the details!");
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed !");
      }

      localStorage.setItem('userToken', data.token);
      
      alert("login succesfull 🎉");
      console.log("Logged in user details:", data.user);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Can't Connect With Server!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-indigo-950 to-black p-4 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Fuzz Mart 🛒
          </h1>
          <p className="text-gray-400 text-sm mt-2">Welcome back! Please login to your account.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm mb-4 text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              ref={userNameRef} 
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600 text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              ref={passwordRef} 
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600 text-white"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading} 
            className={`w-full mt-2 p-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 active:scale-[0.98] ${
              isLoading ? "opacity-50 cursor-not-allowed" : "" 
            }`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don't have an account? <span className="text-purple-400 hover:underline cursor-pointer">Register</span>
        </p>

      </div>
    </div>
  );
}