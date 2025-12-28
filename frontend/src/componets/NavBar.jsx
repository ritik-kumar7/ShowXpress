import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Ticket, X, Menu, Film, Heart, User } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import './NavBar.css'

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { user } = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    const { openSignIn } = useClerk()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isActive = (path) => location.pathname === path

    const navLinks = [
        { path: '/', label: 'Home', icon: null },
        { path: '/movies', label: 'Movies', icon: Film },
        { path: '/favorite', label: 'Favorites', icon: Heart },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark py-3' : 'bg-transparent py-5'
            }`}>
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Film className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white hidden sm:block">
                        Show<span className="text-primary">Xpress</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive(link.path)
                                ? 'bg-primary/20 text-primary'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            to="/my-booking"
                            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isActive('/my-booking')
                                ? 'bg-primary/20 text-primary'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Ticket className="w-4 h-4" />
                            My Bookings
                        </Link>
                    )}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Auth Button */}
                    {!user ? (
                        <button
                            onClick={openSignIn}
                            className="btn btn-primary"
                        >
                            Sign In
                        </button>
                    ) : (
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
                                }
                            }}
                        >
                            <UserButton.MenuItems>
                                <UserButton.Action
                                    label="My Bookings"
                                    labelIcon={<Ticket width={15} />}
                                    onClick={() => navigate('/my-booking')}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    )}

                    {/* Mobile Menu Toggle - Only visible on mobile */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 right-0 glass-dark transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 border-t border-white/10' : 'max-h-0'
                }`}>
                <div className="container-custom py-4 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive(link.path)
                                ? 'bg-primary/20 text-primary'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.icon && <link.icon className="w-5 h-5" />}
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            to="/my-booking"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/my-booking')
                                ? 'bg-primary/20 text-primary'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Ticket className="w-5 h-5" />
                            My Bookings
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar