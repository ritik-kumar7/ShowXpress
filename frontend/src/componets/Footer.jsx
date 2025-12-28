import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import { Film, Github, Linkedin, Twitter, Mail } from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Movies', path: '/movies' },
        { label: 'Favorites', path: '/favorite' },
        { label: 'My Bookings', path: '/my-booking' },
    ]

    return (
        <footer className="footer-container">
            <div className="container-custom">
                {/* Main Footer Content */}
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <div className="footer-logo-icon">
                                <Film className="w-6 h-6 text-white" />
                            </div>
                            <span className="footer-logo-text">
                                Show<span className="text-primary">Xpress</span>
                            </span>
                        </Link>
                        <p className="footer-description">
                            Your ultimate destination for booking movie tickets.
                            Experience cinema like never before.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4 className="footer-links-title">Quick Links</h4>
                        <ul className="footer-links-list">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className="footer-link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-contact">
                        <h4 className="footer-links-title">Get in Touch</h4>
                        <a href="mailto:ritik.r9k@gmail.com" className="footer-contact-item">
                            <Mail className="w-4 h-4 text-primary" />
                            <span>ritik.r9k@gmail.com</span>
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="footer-divider">
                    <div className="footer-bottom">
                        {/* Copyright */}
                        <p className="footer-copyright">
                            © {currentYear} ShowXpress. All rights reserved.
                        </p>

                        {/* Social Links */}
                        <div className="footer-social">
                            <a
                                href="https://github.com/ritik-kumar7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-link"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com/in/ritik-kumar7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-link"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com/ritik_kumar01"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-link"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer