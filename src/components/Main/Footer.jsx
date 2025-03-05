import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/tufavorcito/",
      icon: <Instagram size={20} />,
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/tufavorcito/",
      icon: <Facebook size={20} />,
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@tufavorcit0",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-neutral-light py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Logo y copyright */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="h-6 md:h-8 relative">
              <img
                src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
                alt="Logo"
                className="h-full w-auto object-contain"
              />
            </div>
            <p className="text-neutral-dark text-sm whitespace-nowrap">
              © 2025
            </p>
          </div>

          {/* Links de navegación */}
          <div className="flex justify-center gap-4 md:gap-6 text-sm">
            <a
              href="#"
              className="text-neutral-dark hover:text-primary-dark transition-colors whitespace-nowrap"
            >
              Términos
            </a>
            <a
              href="#"
              className="text-neutral-dark hover:text-primary-dark transition-colors whitespace-nowrap"
            >
              Privacidad
            </a>
            <a
              href="#"
              className="text-neutral-dark hover:text-primary-dark transition-colors whitespace-nowrap"
            >
              Contacto
            </a>
          </div>

          {/* Redes sociales */}
          <div className="flex justify-center md:justify-end gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="w-8 h-8 rounded-full bg-primary-dark text-primary-light flex items-center justify-center hover:bg-opacity-90 transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
