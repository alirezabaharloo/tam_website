import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchContent, setSearchContent] = useState('');
  const searchBarRef = useRef(null);
  const langRef = useRef(null);
  const { user } = useContext(AuthContext);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-us');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (isLangOpen && langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, isLangOpen]);

  // Account button click handler
  const handleAccountClick = () => {
    if (user) {
      navigate('/dashboard'); // or '/profile' if you have a profile page
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="sticky top-2 z-50">
      <div className="w-[1300px] h-24 bg-primary mx-auto mt-4 rounded-2xl shadow-[0_0_16px_rgba(1,22,56,0.5)] relative z-10">
        <div className="flex justify-between items-center h-full relative">
            <nav className="flex space-x-6 ml-8">
                <Link 
                    to="/" 
                    className={`font-inter text-[20px] leading-6 text-quinary-tint-800 no-underline hover:text-tertiary transition-all duration-300 ease-in-out relative group ${
                        location.pathname === '/' ? 'text-tertiary' : ''
                    }`}
                >
                    Home
                    <span className={`absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-in-out ${
                        location.pathname === '/' ? 'w-full bg-tertiary' : 'group-hover:w-full bg-tertiary'
                    }`}></span>
                </Link>
                <Link 
                    to="/news" 
                    className={`font-inter text-[20px] leading-6 text-quinary-tint-800 no-underline hover:text-tertiary transition-all duration-300 ease-in-out relative group ${
                        location.pathname === '/news' ? 'text-tertiary' : ''
                    }`}
                >
                    News
                    <span className={`absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-in-out ${
                        location.pathname === '/news' ? 'w-full bg-tertiary' : 'group-hover:w-full bg-tertiary'
                    }`}></span>
                </Link>
                <Link 
                    to="/shop" 
                    className={`font-inter text-[20px] leading-6 text-quinary-tint-800 no-underline hover:text-tertiary transition-all duration-300 ease-in-out relative group ${
                        location.pathname === '/shop' ? 'text-tertiary' : ''
                    }`}
                >
                    Shop
                    <span className={`absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-in-out ${
                        location.pathname === '/shop' ? 'w-full bg-tertiary' : 'group-hover:w-full bg-tertiary'
                    }`}></span>
                </Link>
                <button 
                    onClick={scrollToContact}
                    className={`font-inter text-[20px] leading-6 text-quinary-tint-800 no-underline hover:text-tertiary transition-all duration-300 ease-in-out relative group`}
                >
                    Contact
                    <span className={`absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-in-out group-hover:w-full bg-tertiary`}></span>
                </button>
                <Link 
                    to="/about" 
                    className={`font-inter text-[20px] leading-6 text-quinary-tint-800 no-underline hover:text-tertiary transition-all duration-300 ease-in-out relative group ${
                        location.pathname === '/about' ? 'text-tertiary' : ''
                    }`}
                >
                    About
                    <span className={`absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-in-out ${
                        location.pathname === '/about' ? 'w-full bg-tertiary' : 'group-hover:w-full bg-tertiary'
                    }`}></span>
                </Link>
            </nav>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img src="/images/logos/HeaderLogo.svg" alt="Logo" className="h-[95px] w-[48px] object-contain" />
            </div>
            <div className="flex items-center mr-8">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`focus:outline-none transition-all duration-300 ${isSearchOpen ? 'opacity-0' : 'opacity-100'}`}
                        >
                            <img 
                                src="/images/icons/SearchLogo.svg" 
                                alt="Search" 
                                className="text-quinary-tint-800 hover:text-secondary transition-colors duration-300"
                            />
                        </button>
                        <div 
                            ref={searchBarRef}
                            className={`absolute right-[-16px] top-1/2 -translate-y-1/2 h-12 w-[300px] bg-quinary-tint-600 rounded-lg flex items-center transition-all duration-300 ease-out ${
                                isSearchOpen 
                                    ? 'translate-x-0 opacity-100' 
                                    : 'translate-x-8 opacity-0 pointer-events-none'
                            }`}
                        >
                            <div className="flex items-center">
                                <img 
                                    src="/images/icons/SearchLogoBlack.svg" 
                                    alt="Search" 
                                    className="ml-4 h-6 w-6"
                                />
                                <div className="h-9 border-l-[1px] border-secondary ml-4"></div>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="flex-1 h-full px-4 bg-transparent outline-none text-secondary placeholder-secondary/50"
                                value={searchContent}
                                onChange={(e) => setSearchContent(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="h-12 w-px bg-[#F2FAFF] opacity-50"></div>
                    <button onClick={handleAccountClick} className="flex items-center group h-12 focus:outline-none">
                      {user ? (
                        <>
                          <span className="text-quinary-tint-800 text-[20px] font-normal mr-1">{user.phone}</span>
                          <img src="/images/icons/UserLogo2.svg" alt="User" className="w-[32px] h-[32px] transition-colors duration-200 group-hover:text-quinary-tint-600 text-quinary-tint-800" />
                        </>
                      ) : (
                        <img src="/images/icons/UserLogo.svg" alt="User" className="w-[23px] h-[30px] transition-colors duration-200 group-hover:text-quinary-tint-600 text-quinary-tint-800" />
                      )}
                    </button>
                    <div className="h-12 w-px bg-[#F2FAFF] opacity-50"></div>
                    <div className="relative">
                        <button 
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="focus:outline-none"
                        >
                            <img 
                                src="/images/icons/LangLogo.svg" 
                                alt="lang" 
                                className="text-quinary-tint-800 hover:text-secondary transition-colors duration-300"
                            />
                        </button>
                        <div 
                            ref={langRef}
                            className={`absolute right-0 top-0 h-[175px] w-[280px] bg-quinary-tint-600 rounded-lg transition-all duration-300 ease-out ${
                                isLangOpen 
                                    ? 'translate-y-0 opacity-100' 
                                    : 'translate-y-2 opacity-0 pointer-events-none'
                            }`}
                        >
                            <div className="flex items-center pt-4 pb-4 pl-4 pr-4">
                                <img 
                                    src="/images/icons/LangLogoBlack.svg" 
                                    alt="Language" 
                                    className="h-6 w-6"
                                />
                                <span className="ml-1.5 text-[20px] leading-[30px] text-secondary font-inter">
                                    select your language
                                </span>
                            </div>
                            <div className="h-px w-[calc(100%-32px)] bg-secondary/50 mx-4"></div>
                            <div className="flex flex-col space-y-6 p-4">
                                <div className="flex items-center">
                                    <img 
                                        src="/images/icons/IranFlag.svg" 
                                        alt="فارسی" 
                                        className="w-9 h-6"
                                    />
                                    <span className="ml-2 text-secondary font-inter">
                                        فارسی
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <img 
                                        src="/images/icons/UKFlag.svg" 
                                        alt="English" 
                                        className="w-9 h-6"
                                    />
                                    <span className="ml-2 text-secondary font-inter">
                                        English
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
