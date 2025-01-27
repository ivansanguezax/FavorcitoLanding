import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "primereact/button"

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const buttonBaseClass = !scrolled
    ? "border-2 border-[#02533C] text-[#02533C] hover:bg-[#02533C] hover:text-white transition-all duration-300"
    : "bg-[#D3FE94] border-2 border-transparent text-[#02533C] hover:bg-transparent hover:border-[#D3FE94] hover:text-[#D3FE94] transition-all duration-300"

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 }
  }

  return (
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
              className={`px-6 py-2 rounded-full font-light flex items-center gap-2 ${buttonBaseClass}`}
              label="Soy estudiante"
              icon="pi pi-arrow-up-right"
              iconPos="right"
            />
            <Button
              className={`px-6 py-2 rounded-full font-light flex items-center gap-2 ${buttonBaseClass}`}
              label="Quiero un favorcito"
              icon="pi pi-arrow-up-right"
              iconPos="right"
            />
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <i className={`pi pi-arrow-up-right text-2xl ${scrolled ? 'text-white' : 'text-[#02533C]'}`} />
          </motion.button>
        </div>
      </motion.nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
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
                className={`px-6 py-2 rounded-full font-light bg-[#D3FE94] border-2 border-transparent text-[#02533C] hover:bg-transparent hover:border-[#D3FE94] hover:text-[#D3FE94] transition-all duration-300`}
                label="Unirme"
                icon="pi pi-arrow-up-right"
                iconPos="right"
              />
              <Button
                className={`px-6 py-2 rounded-full font-light bg-[#D3FE94] border-0 text-[#02533C] hover:bg-transparent hover:border-[#D3FE94] hover:border-2 hover:text-[#D3FE94] transition-all duration-300`}
                label="Quiero un favorcito"
                icon="pi pi-arrow-up-right"
                iconPos="right"
              />
              
              <div className="flex gap-4 justify-center mt-4">
                <i className="pi pi-instagram text-white text-xl cursor-pointer hover:opacity-80" />
                <i className="pi pi-facebook text-white text-xl cursor-pointer hover:opacity-80" />
                <i className="pi pi-tiktok text-white text-xl cursor-pointer hover:opacity-80" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}