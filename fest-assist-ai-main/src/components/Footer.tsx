import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaCalendarAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="glass-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CEMS
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop platform for discovering and managing college events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Technical Events
              </li>
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Cultural Events
              </li>
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Sports Events
              </li>
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Workshops
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary transition-colors group"
              >
                <FaGithub className="text-lg group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary transition-colors group"
              >
                <FaTwitter className="text-lg group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary transition-colors group"
              >
                <FaLinkedin className="text-lg group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary transition-colors group"
              >
                <FaInstagram className="text-lg group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CEMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
