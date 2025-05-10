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
  const [isRegister, setIsRegister] = useState(false)
  // Register states
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regPhoneError, setRegPhoneError] = useState('')
  const [regPasswordError, setRegPasswordError] = useState('')
  const [regConfirmError, setRegConfirmError] = useState('')
  const [regPasswordStrengthError, setRegPasswordStrengthError] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [regPasswordLengthError, setRegPasswordLengthError] = useState('')
  const [regPasswordContentError, setRegPasswordContentError] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', ''])
  const otpInputs = [0, 1, 2, 3, 4]
  const otpRefs = otpInputs.map(() => React.createRef())
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpTimer, setOtpTimer] = useState(120)
  const [otpResendActive, setOtpResendActive] = useState(false)
  const OTP_CODE = '12345'
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setUser(JSON.parse(rememberedUser));
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (!otpStep) return;
    setOtpDigits(['', '', '', '', '']);
    setOtp('');
  }, [otpStep])

  useEffect(() => {
    if (!otpStep) return;
    if (otpTimer === 0) {
      setOtpResendActive(true);
      return;
    }
    setOtpResendActive(false);
    const interval = setInterval(() => {
      setOtpTimer(t => t > 0 ? t - 1 : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [otpStep, otpTimer])

  useEffect(() => {
    if (otpStep && otpDigits.every(d => d.length === 1)) {
      // Auto-submit OTP when all fields are filled
      if (otpDigits.join('') !== otp) setOtp(otpDigits.join(''));
      setTimeout(() => {
        document.getElementById('otp-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 100);
    }
  }, [otpDigits, otpStep]);

  // Register validation
  useEffect(() => {
    if (!isRegister) return;
    if (regPhone.length === 0) {
      setRegPhoneError('Your Phone Number is Invalid');
    } else if (regPhone.length !== 11 || !regPhone.startsWith('09')) {
      setRegPhoneError('Your Phone Number is Invalid');
    } else {
      setRegPhoneError('');
    }
    if (regPassword.length > 0 && regConfirm.length > 0 && regPassword !== regConfirm) {
      setRegConfirmError('Passwords do not match');
    } else {
      setRegConfirmError('');
    }
    // Split password errors
    if (regPassword.length > 0 && regPassword.length < 8) {
      setRegPasswordLengthError('Password must be at least 8 characters');
    } else {
      setRegPasswordLengthError('');
    }
    if (regPassword.length > 0 && !(/[a-zA-Z]/.test(regPassword) && /\d/.test(regPassword))) {
      setRegPasswordContentError('Use letters and numbers');
    } else {
      setRegPasswordContentError('');
    }
  }, [isRegister, regPhone, regPassword, regConfirm]);

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

  const handleRegister = (e) => {
    e.preventDefault();
    if (regPhoneError || regPasswordLengthError || regPasswordContentError || regConfirmError || !regPhone || !regPassword || !regConfirm) return;
    // Add to fakeUsers
    fakeUsers.push({ phone: regPhone, password: regPassword });
    setOtpStep(true);
    setOtp('');
    setOtpError('');
    setOtpTimer(120);
    setOtpResendActive(false);
    // Don't log in yet, wait for OTP
  }

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === OTP_CODE) {
      setUser({ phone: regPhone });
      setIsModalOpen(true);
      setIsRegister(false);
      setOtpStep(false);
      setRegPhone(''); setRegPassword(''); setRegConfirm('');
    } else {
      setOtpError('Invalid OTP code');
    }
  }

  const handleResendOtp = () => {
    setOtp('');
    setOtpError('');
    setOtpTimer(120);
    setOtpResendActive(false);
    // In real app, send code again
  }

  const handleOtpDigitChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newDigits = [...otpDigits]
    newDigits[idx] = val
    setOtpDigits(newDigits)
    setOtp(newDigits.join(''))
    if (val && idx < 4) {
      otpRefs[idx + 1].current.focus()
    }
  }

  const handleOtpDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs[idx - 1].current.focus()
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
          {isRegister ? (
            otpStep ? (
              <>
                <h2 className="text-[36px] font-bold text-primary mt-[32px]">OTP Verification</h2>
                <div className="w-[400px] mt-[32px] flex flex-col items-center">
                  <span className="text-[18px] text-primary mb-4">Enter the code sent to your phone</span>
                  <form id="otp-form" onSubmit={handleOtpSubmit} className="w-full flex flex-col items-center">
                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-4 mb-4">
                      {otpInputs.map((idx) => (
                        <input
                          key={idx}
                          ref={otpRefs[idx]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className="w-12 h-14 text-center text-[28px] font-bold rounded-xl border-2 border-quaternary-tint-800 bg-quaternary-tint-800 text-primary focus:border-primary outline-none transition-all duration-200 shadow-[2px_2px_8px_0_rgba(0,0,0,0.10)]"
                          value={otpDigits[idx]}
                          onChange={e => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpDigitKeyDown(idx, e)}
                        />
                      ))}
                    </div>
                    {otpError && (
                      <div className="flex items-center ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-quaternary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="ml-1 text-[16px] font-normal text-quaternary">{otpError}</span>
                      </div>
                    )}
                    {/* Creative Timer */}
                    <div className="flex flex-col items-center mt-4 mb-2">
                      <div className="relative flex items-center justify-center">
                        <svg width="56" height="56" viewBox="0 0 56 56">
                          <circle cx="28" cy="28" r="26" stroke="#E0E7EF" strokeWidth="4" fill="none" />
                          <circle
                            cx="28" cy="28" r="26"
                            stroke="#980B1C"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 26}
                            strokeDashoffset={(2 * Math.PI * 26) * (1 - otpTimer / 120)}
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                          />
                        </svg>
                        <span className="absolute text-[12px] font-bold text-primary">
                          {Math.floor(otpTimer/60).toString().padStart(2,'0')}:{(otpTimer%60).toString().padStart(2,'0')}
                        </span>
                      </div>
                      <button type="button" onClick={handleResendOtp} disabled={!otpResendActive} className={`mt-2 text-primary text-[16px] font-semibold transition-opacity ${otpResendActive ? '' : 'opacity-40 cursor-not-allowed'}`}>Resend Code</button>
                    </div>
                    <button type="submit" className="w-[150px] h-[39px] mt-[32px] bg-gradient-to-br from-primary to-quaternary rounded-[45px] text-white text-[16px] font-semibold flex items-center justify-center transition-all duration-300 hover:from-quaternary hover:to-primary">Verify</button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-[36px] font-bold text-primary mt-[32px]">User Register</h2>
                {/* Phone Input */}
                <div className="w-[400px] h-[54px] bg-quaternary-tint-800 rounded-[100px] mt-[32px] flex items-center px-6 shadow-[2px_2px_8px_0_rgba(0,0,0,0.25)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={32} height={32} className="text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="ml-4 bg-transparent outline-none text-primary text-[20px] font-normal w-full placeholder:text-primary"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                  />
                </div>
                {/* Phone Error */}
                {regPhoneError && (
                  <div className="w-[400px] flex items-center mt-2 ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-quaternary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="ml-1 text-[16px] font-normal text-quaternary">{regPhoneError}</span>
                  </div>
                )}
                {/* Password Input */}
                <div className="w-[400px] h-[54px] bg-quaternary-tint-800 rounded-[100px] mt-2 flex items-center px-6 shadow-[2px_2px_8px_0_rgba(0,0,0,0.25)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={32} height={32} className="text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="ml-4 bg-transparent outline-none text-primary text-[20px] font-normal w-full placeholder:text-primary"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
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
                {/* Confirm Password Input */}
                <div className="w-[400px] h-[54px] bg-quaternary-tint-800 rounded-[100px] mt-4 flex items-center px-6 shadow-[2px_2px_8px_0_rgba(0,0,0,0.25)]">
                  <img src="/images/icons/RepeatPass.svg" alt="Repeat Password" width={32} height={32} className="text-primary" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="ml-4 bg-transparent outline-none text-primary text-[20px] font-normal w-full placeholder:text-primary"
                    value={regConfirm}
                    onChange={e => setRegConfirm(e.target.value)}
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-4 text-primary"
                    type="button"
                  >
                    {showConfirmPassword ? (
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
                {/* Password Errors */}
                <div className="w-[400px] flex flex-col mt-[14PX] gap-1">
                  {(() => {
                    const errors = [];
                    if (regConfirmError) errors.push(
                      <div className="flex items-center ml-4" key="confirm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-quaternary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="ml-1 text-[16px] font-normal text-quaternary">{regConfirmError}</span>
                      </div>
                    );
                    if (regPasswordLengthError) errors.push(
                      <div className="flex items-center ml-4" key="length">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-quaternary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="ml-1 text-[16px] font-normal text-quaternary">{regPasswordLengthError}</span>
                      </div>
                    );
                    if (regPasswordContentError) errors.push(
                      <div className="flex items-center ml-4" key="content">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-quaternary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="ml-1 text-[16px] font-normal text-quaternary">{regPasswordContentError}</span>
                      </div>
                    );
                    return errors.slice(0, 2);
                  })()}
                </div>
                {/* Register Button */}
                <button onClick={handleRegister} className="w-[150px] h-[39px] mt-[16px] bg-gradient-to-br from-primary to-quaternary rounded-[45px] text-white text-[16px] font-semibold flex items-center justify-center transition-all duration-300 hover:from-quaternary hover:to-primary">Register</button>
                {/* OR Separator */}
                <div className="flex items-center w-[400px] mt-[24px]">
                  <div className="h-[1px] w-[180px] bg-primary opacity-40" />
                  <span className="mx-4 text-[24px] font-light text-primary">OR</span>
                  <div className="h-[1px] w-[180px] bg-primary opacity-40" />
                </div>
                {/* Login Row */}
                <div className="w-[400px] flex flex-row flex-nowrap items-center justify-end mt-[16px]">
                  <span className="text-[20px] font-semibold text-primary mr-4 whitespace-nowrap">Already have an account?</span>
                  <button type="button" onClick={() => setIsRegister(false)} className="w-[150px] h-[39px] box-border border-2 border-primary text-primary text-[16px] font-semibold rounded-[45px] flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white">Login</button>
                </div>
              </>
            )
          ) : (
            <>
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
                <button type="button" onClick={() => setIsRegister(true)} className="w-[150px] h-[39px] box-border border-2 border-primary text-primary text-[16px] font-semibold rounded-[45px] flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white">Register</button>
              </div>
            </>
          )}
        </div>
        
      </div>
    </>
  )
}
