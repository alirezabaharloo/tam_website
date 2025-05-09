import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { fakeUsers } from '../data/fakeUsers'
import Modal from '../components/Modal'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setUser(JSON.parse(rememberedUser));
      navigate('/');
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault()
    const user = fakeUsers.find(u => u.phone === phone && u.password === password)
    if (user) {
      setUser({ phone: user.phone })
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ phone: user.phone }))
      } else {
        localStorage.removeItem('rememberedUser')
      }
      setIsModalOpen(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          navigate('/')
        }}
        data={{
          title: 'Login Successful',
          content: 'You have successfully logged in!',
          onlyAcceptable: true
        }}
      />
      <div className="w-[1300px] h-[600px] mx-auto mt-8 flex shadow-[4px_4px_16px_0_rgba(0,0,0,0.25)] rounded-2xl">
        {/* Left Section */}
        <div className="w-[780px] h-full bg-gradient-to-br from-primary to-quaternary relative rounded-l-2xl">
          <div className="absolute top-[96px] left-[64px]">
            <h1 className="text-[48px] font-bold text-quinary-tint-800">
              Welcome To Website
            </h1>
            <p className="text-[24px] font-normal text-quinary-tint-800 mt-4 max-w-[600px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Egestas purus viverra accumsan in nisl nisi Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque ...
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-[520px] h-[600px] bg-quinary-tint-800 rounded-r-2xl flex flex-col items-center">
          <h2 className="text-[36px] font-bold text-primary mt-16">User Login</h2>
          
          {/* Phone Input */}
          <div className="w-[400px] h-[54px] bg-quaternary-tint-800 rounded-[100px] mt-9 flex items-center px-6 shadow-[2px_2px_8px_0_rgba(0,0,0,0.25)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={32} height={32} className="text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>

            <input 
              type="text" 
              placeholder="Phone Number" 
              className="ml-4 bg-transparent outline-none text-primary text-[20px] font-normal w-full placeholder:text-primary"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="w-[400px] h-[54px] bg-quaternary-tint-800 rounded-[100px] mt-6 flex items-center px-6 shadow-[2px_2px_8px_0_rgba(0,0,0,0.25)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={32} height={32} className="text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>

            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="ml-4 bg-transparent outline-none text-primary text-[20px] font-normal w-full placeholder:text-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="ml-4 text-primary"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
          <div className="w-[400px] flex items-center mt-2 ml-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-quaternary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span className="ml-1 text-[16px] font-normal text-quaternary">Phone number or password is incorrect</span>
          </div>
          )}

          {/* Remember Me and Forgot Password */}
          <div className="w-[400px] flex justify-between items-center mt-4 ml-16">
            <div className="flex items-center">
              <button 
                onClick={() => setRememberMe(!rememberMe)}
                className="text-primary"
              >
                {rememberMe ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                )}
              </button>
              <span className="ml-1 text-[20px] font-normal text-primary">Remember</span>
            </div>
            <a href="#" className="pr-16 text-[20px] font-normal text-primary">Forgot Password?</a>
          </div>

          {/* LOGIN Button */}
          <button onClick={handleLogin} className="w-[150px] h-[39px] mt-9 bg-gradient-to-br from-primary to-quaternary rounded-[45px] text-white text-[16px] font-semibold flex items-center justify-center transition-all duration-300 hover:from-quaternary hover:to-primary">LOGIN</button>

          {/* OR Separator */}
          <div className="flex items-center w-[400px] mt-8">
            <div className="h-[1px] w-[180px] bg-primary opacity-40" />
            <span className="mx-4 text-[24px] font-light text-primary">OR</span>
            <div className="h-[1px] w-[180px] bg-primary opacity-40" />
          </div>

          {/* Register Row */}
          <div className="w-[400px] flex items-center justify-end mt-6">
            <span className="text-[20px] font-semibold text-primary mr-4">Don't have an account?</span>
            <button className="w-[150px] h-[39px] box-border border-2 border-primary text-primary text-[16px] font-semibold rounded-[45px] flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white">Register</button>
          </div>
        </div>
        
      </div>
    </>
  )
}
