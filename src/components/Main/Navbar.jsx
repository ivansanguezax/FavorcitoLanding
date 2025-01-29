import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "primereact/button"
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

export const Navbar = () => {
  const toast = useRef(null);
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const menuRef = useRef(null)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const buttonBaseClass = !scrolled
    ? "border-2 border-[#02533C] text-[#02533C] hover:bg-[#02533C] hover:text-white transition-all duration-300"
    : "bg-[#D3FE94] border-2 border-transparent text-[#02533C] hover:bg-transparent hover:border-[#D3FE94] hover:text-[#D3FE94] transition-all duration-300"

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 }
  }

  const handleSocialClick = (network) => {
    toast.current.show({
      severity: 'info',
      summary: '¡Muy pronto!',
      detail: `Estamos trabajando en traerte contenido increíble en ${network}. ¡Mantente atento!`,
      life: 3000,
      style: { 
        background: '#D3FE94',
        color: '#02533C',
        border: 'none'
      }
    });
  }



  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <Dialog 
        visible={showModal} 
        onHide={() => setShowModal(false)}
        header="¡Muy Pronto!"
        draggable={false}
        resizable={false}
        className="w-11/12 md:w-2/3 lg:w-1/2"
        contentClassName="bg-white"
        headerClassName="bg-[#02533C] text-[#D3FE94]"
        style={{ borderRadius: '1rem' }}
      >
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold text-[#02533C] mb-4">
              ¡Estamos preparando algo increíble!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl">
              Muy pronto podrás unirte a nuestra comunidad y acceder a todos nuestros servicios exclusivos. ¡Prepárate para una experiencia única!
            </p>
            <ul className="space-y-3 text-left w-full max-w-md">
              <li className="flex items-center text-gray-600">
                <i className="pi pi-check-circle mr-2 text-[#02533C]"></i>
                Conecta con otros estudiantes
              </li>
              <li className="flex items-center text-gray-600">
                <i className="pi pi-check-circle mr-2 text-[#02533C]"></i>
                Accede a recursos exclusivos
              </li>
              <li className="flex items-center text-gray-600">
                <i className="pi pi-check-circle mr-2 text-[#02533C]"></i>
                Participa en eventos especiales
              </li>
            </ul>
          </div>
        </div>
      </Dialog>

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
                onClick={() => setShowModal(true)}
                className={`px-6 py-2 rounded-full font-light flex items-center gap-2 ${buttonBaseClass}`}
                label="Soy estudiante"
                icon="pi pi-arrow-up-right"
                iconPos="right"
              />
              <Button
                onClick={() => setShowModal(true)}
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
              <i className={`pi pi-bars text-2xl ${scrolled ? 'text-white' : 'text-[#02533C]'}`} />
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
                  onClick={() => {
                    setShowModal(true);
                    setMobileMenu(false);
                  }}
                  className={`px-6 py-2 rounded-full font-light bg-[#D3FE94] border-2 border-transparent text-[#02533C] hover:bg-transparent hover:border-[#D3FE94] hover:text-[#D3FE94] transition-all duration-300`}
                  label="Unirme"
                  icon="pi pi-arrow-up-right"
                  iconPos="right"
                />
                <Button
                  onClick={() => {
                    setShowModal(true);
                    setMobileMenu(false);
                  }}
                  className={`px-6 py-2 rounded-full font-light bg-[#D3FE94] border-0 text-[#02533C] hover:bg-transparent hover:border-[#D3FE94] hover:border-2 hover:text-[#D3FE94] transition-all duration-300`}
                  label="Quiero un favorcito"
                  icon="pi pi-arrow-up-right"
                  iconPos="right"
                />
                
                <div className="flex gap-4 justify-center mt-4">
                  <i 
                    onClick={() => handleSocialClick('Instagram')}
                    className="pi pi-instagram text-white text-xl cursor-pointer hover:opacity-80" 
                  />
                  <i 
                    onClick={() => handleSocialClick('Facebook')}
                    className="pi pi-facebook text-white text-xl cursor-pointer hover:opacity-80" 
                  />
                  <i 
                    onClick={() => handleSocialClick('TikTok')}
                    className="pi pi-twitter text-white text-xl cursor-pointer hover:opacity-80" 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}