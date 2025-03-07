import CalculatorPopup from "../components/common/CalculatorPopup";
import TopBanner from "../components/common/TopBanner";
import { useEffect, useState } from "react";

const CalculatorPromotion = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if the popup has been shown before
    const popupShown = localStorage.getItem("calculatorPopupShown");
    
    if (!popupShown) {
      // Show popup after page loads
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      // If popup was shown before, display the banner directly
      setShowBanner(true);
    }
  }, []);
  
  const handleClosePopup = () => {
    setShowPopup(false);
    // Mark that popup has been shown in localStorage
    localStorage.setItem("calculatorPopupShown", "true");
    
    // Show banner after closing popup
    setShowBanner(true);
  };
  
  return (
    <>
      {showPopup && <CalculatorPopup onClose={handleClosePopup} />}
      {showBanner && <TopBanner />}
    </>
  );
};

export default CalculatorPromotion;