import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import Galaxy from '../components/Galaxy'
import '../styles/Login.css'

const roles = [
  'Web Developer',
  'UI Designer',
  'Arabic Learner',
  'Creative Thinker',
]

export default function Login() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [roleText, setRoleText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const btnRef = useRef(null)
  const cardRef = useRef(null)
  const rafRef = useRef(null)

  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    const speed = isDeleting ? 50 : 100
    const timeout = setTimeout(() => {
      const currentRole = roles[roleIndex]
      if (!isDeleting) {
        if (charIndex < currentRole.length) {
          setRoleText(currentRole.slice(0, charIndex + 1))
          setCharIndex((prev) => prev + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setRoleText(currentRole.slice(0, charIndex - 1))
          setCharIndex((prev) => prev - 1)
        } else {
          setIsDeleting(false)
          setRoleIndex((prev) => (prev + 1) % roles.length)
          setCharIndex(0)
        }
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, roleIndex])

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || success) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const x = (e.clientX - centerX) / 25
      const y = (e.clientY - centerY) / 25
      cardRef.current.style.transform =
        `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`
    })
  }, [success])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    cardRef.current.style.transform =
      'perspective(1000px) rotateY(0deg) rotateX(0deg)'
  }, [])

  const handleRipple = (e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'login-btn-ripple'
    const size = Math.max(rect.width, rect.height)
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = e.clientX - rect.left - size / 2 + 'px'
    ripple.style.top = e.clientY - rect.top - size / 2 + 'px'
    btn.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username) {
      setError('Username wajib diisi')
      return
    }

    if (!email) {
      setError('Email wajib diisi')
      return
    }

    setLoading(true)

    setTimeout(() => {
      setSuccess(true)
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('username', username)
        navigate('/', { replace: true })
      }, 1200)
    }, 1500)
  }

  return (
    <div className="login-page">
      {/* Galaxy Background */}
      <div className="login-galaxy-bg">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={210}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
          transparent={true}
        />
      </div>

      {/* Overlay gradient untuk blend dengan portfolio colors */}
      <div className="login-galaxy-overlay"></div>

      <div className={`login-card-wrapper ${success ? 'success' : ''}`}>
        <div
          className={`login-card ${success ? 'success' : ''}`}
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="login-card-inner">
            <div className="login-header">
              <h1 className="login-title">SIGN IN</h1>
              <div className="login-typing">
                <span className="login-typing-text">{roleText}</span>
                <span className="login-typing-cursor">|</span>
              </div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className={`login-input-group ${focusedField === 'username' || username ? 'focused' : ''}`}>
                <label className="login-label">Username</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="username"
                />
              </div>

              <div className={`login-input-group ${focusedField === 'email' || email ? 'focused' : ''}`}>
                <label className="login-label">Email</label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                />
              </div>

              <div className="login-forgot">
                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={() => {}}
                >
                  Forgot Password?
                </button>
              </div>

              {error && <p className="login-error">{error}</p>}

              <button
                type="submit"
                className={`login-btn ${loading ? 'loading' : ''} ${success ? 'success' : ''}`}
                ref={btnRef}
                onClick={handleRipple}
                disabled={loading || success}
              >
                {success ? (
                  <span className="login-check">
                    <FiCheck />
                  </span>
                ) : loading ? (
                  <span className="login-spinner"></span>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
