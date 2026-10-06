import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLogOut } from 'react-icons/fi'
import '../styles/Navbar.css'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/project' },
  { name: 'Sertifikat', path: '/sertifikat' },
  { name: 'Tugas SKL', path: '/tugas-skl' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const username = localStorage.getItem('username') || ''

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    // Close mobile menu on route change
    document.body.style.overflow = 'auto'
  }, [location])

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileOpen])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    setMobileOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">P</span>
          Portfolio.
        </Link>

        <button
          className={`navbar-hamburger ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <AnimatePresence>
          {mobileOpen && window.innerWidth <= 768 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="navbar-overlay"
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 1000,
                backdropFilter: 'blur(2px)',
              }}
            />
          )}
        </AnimatePresence>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={mobileOpen ? { opacity: 0, x: 30 } : false}
              animate={mobileOpen ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
          {isLoggedIn && (
            <>
              <motion.span
                className="navbar-welcome"
                initial={mobileOpen ? { opacity: 0, x: 30 } : false}
                animate={mobileOpen ? { opacity: 1, x: 0 } : false}
                transition={{ duration: 0.3, delay: navLinks.length * 0.08 }}
              >
                Welcome, {username}
              </motion.span>
              <motion.button
                className="navbar-logout-btn"
                onClick={handleLogout}
                initial={mobileOpen ? { opacity: 0, x: 30 } : false}
                animate={mobileOpen ? { opacity: 1, x: 0 } : false}
                transition={{ duration: 0.3, delay: (navLinks.length + 1) * 0.08 }}
              >
                <FiLogOut />
                Logout
              </motion.button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
