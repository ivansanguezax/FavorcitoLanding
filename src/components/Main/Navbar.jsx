import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "primereact/button"
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const menuRef = useRef(null)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.menu-toggle-button')) {
        return;
      }
      
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenu(false);
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const buttonBaseClass = !scrolled
    ? "border-2 border-[#02533C] text-[#02533C] hover:bg-[#02533C] hover:text-white transition-all duration-300"
    : "bg-[#D3FE94] border-2 border-transparent text-[#02533C] hover:bg-transparent hover:border-[#D3FE94] hover:text-[#D3FE94] transition-all duration-300"

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 }
  }

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/tufavorcito/'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/tufavorcito/'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@tufavorcit0'
    }
  ];

  const handleSocialClick = (social) => {
    window.open(social.url, '_blank');
  }

  return (
    <>
      <Toast ref={toast} position="bottom-right" />

      <header className="fixed w-full z-50">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            transition-all duration-300 ease-in-out
            ${scrolled ? 
              'bg-[#02533C] shadow-lg mx-4 md:mx-8 mt-4 rounded-full py-3 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 
              'bg-transparent py-4 px-4'
            }
          `}
        >
          <div className="container mx-auto flex justify-between items-center">
            <img 
              src={scrolled ? 
                "https://res.cloudinary.com/dfgjenml4/image/upload/v1737657600/logoLigth_gbv7ds.png" :
                "https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
              }
              alt="Logo"
              className="h-6 md:h-8 w-auto"
            />
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Button
                onClick={() => window.location.href = 'https://app.tufavorcito.com'}
                className={`px-6 py-2 rounded-full font-light flex items-center gap-2 ${buttonBaseClass}`}
                label="Quiero un favorcito"
                icon="pi pi-arrow-up-right"
                iconPos="right"
              />
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button
  whileTap={{ scale: 0.95 }}
  className="md:hidden menu-toggle-button"
  onClick={() => setMobileMenu(!mobileMenu)}
>
              <i className={`${mobileMenu ? 'pi pi-times' : 'pi pi-bars'} text-2xl ${scrolled ? 'text-white' : 'text-[#02533C]'}`} />
            </motion.button>
          </div>
        </motion.nav>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              ref={menuRef}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={`
                mx-4 md:mx-8 
                ${scrolled ? 
                  'bg-[#02533C] mt-1 rounded-3xl' : 
                  'bg-[#02533C] rounded-3xl'
                } 
                shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                md:hidden
              `}
            >
              <div className="flex flex-col gap-4 p-6">
                <Button
                  onClick={() => navigate('/estudiante')}
                  className={`px-6 py-2 rounded-full font-light bg-[#D3FE94] border-2 border-transparent text-[#02533C] hover:bg-transparent hover:border-[#D3FE94] hover:text-[#D3FE94] transition-all duration-300`}
                  label="Unirme"
                  icon="pi pi-arrow-up-right"
                  iconPos="right"
                />
                <Button
                  onClick={() => window.location.href = 'https://app.tufavorcito.com'}
                  className={`px-6 py-2 rounded-full font-light bg-[#D3FE94] border-0 text-[#02533C] hover:bg-transparent hover:border-[#D3FE94] hover:border-2 hover:text-[#D3FE94] transition-all duration-300`}
                  label="Quiero un favorcito"
                  icon="pi pi-arrow-up-right"
                  iconPos="right"
                />
                
                <div className="flex gap-4 justify-center mt-4">
                  <i 
                    onClick={() => handleSocialClick(socialLinks[0])}
                    className="pi pi-instagram text-white text-xl cursor-pointer hover:opacity-80" 
                  />
                  <i 
                    onClick={() => handleSocialClick(socialLinks[1])}
                    className="pi pi-facebook text-white text-xl cursor-pointer hover:opacity-80" 
                  />
                  <svg
                    onClick={() => handleSocialClick(socialLinks[2])}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white cursor-pointer hover:opacity-80"
                  >
                    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}