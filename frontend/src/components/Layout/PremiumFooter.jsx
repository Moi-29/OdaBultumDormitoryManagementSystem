import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const PremiumFooter = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        'Quick Links': [
            { label: 'About OBU', href: '#' },
            { label: 'Admissions', href: '#' },
            { label: 'Academic Programs', href: '#' },
            { label: 'Campus Life', href: '#' }
        ],
        'Student Services': [
            { label: 'Dormitory Services', href: '#' },
            { label: 'Cafeteria', href: '#' },
            { label: 'Health Center', href: '#' },
            { label: 'Student Union', href: '#' }
        ],
        'Resources': [
            { label: 'Library', href: '#' },
            { label: 'IT Support', href: '#' },
            { label: 'Career Services', href: '#' },
            { label: 'Counseling', href: '#' }
        ]
    };

    const socialLinks = [
        { icon: Facebook, href: '#', color: '#1877f2', label: 'Facebook' },
        { icon: Twitter, href: '#', color: '#1da1f2', label: 'Twitter' },
        { icon: Instagram, href: '#', color: '#e4405f', label: 'Instagram' },
        { icon: Linkedin, href: '#', color: '#0077b5', label: 'LinkedIn' }
    ];

    return (
        <footer style={{
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Golden Divider */}
            <div style={{
                height: '4px',
                background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #4f46e5 100%)',
                backgroundSize: '200% 100%',
                animation: 'gradientShift 8s ease infinite'
            }} />

            {/* Main Footer Content */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '4rem 2rem 2rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    {/* University Info */}
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}>
                                <Building2 size={32} color="white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #10b981, #f59e0b)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    OBU
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.85rem',
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }}>
                                    Student Portal
                                </p>
                            </div>
                        </div>
                        <p style={{
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '1.5rem'
                        }}>
                            Oda Bultum University - Empowering students through excellence in education, innovation, and community.
                        </p>
                        {/* Social Links */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            {socialLinks.map((social, i) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={i}
                                        href={social.href}
                                        aria-label={social.label}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            textDecoration: 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = social.color;
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = `0 6px 20px ${social.color}50`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <Icon size={20} color="white" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 style={{
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                marginBottom: '1.5rem',
                                color: 'white'
                            }}>
                                {category}
                            </h4>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}>
                                {links.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link.href}
                                            style={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                textDecoration: 'none',
                                                fontSize: '0.95rem',
                                                transition: 'all 0.3s',
                                                display: 'inline-block'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#10b981';
                                                e.currentTarget.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact Info */}
                <div style={{
                    padding: '2rem 0',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'rgba(16, 185, 129, 0.2)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <MapPin size={24} color="#10b981" />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '0.25rem'
                                }}>
                                    Address
                                </div>
                                <div style={{
                                    fontSize: '0.95rem',
                                    color: 'white',
                                    fontWeight: 600
                                }}>
                                    Oda Bultum, Ethiopia
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'rgba(217, 119, 6, 0.2)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Phone size={24} color="#f59e0b" />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '0.25rem'
                                }}>
                                    Phone
                                </div>
                                <div style={{
                                    fontSize: '0.95rem',
                                    color: 'white',
                                    fontWeight: 600
                                }}>
                                    +251-911-000-000
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'rgba(79, 70, 229, 0.2)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Mail size={24} color="#4f46e5" />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '0.25rem'
                                }}>
                                    Email
                                </div>
                                <div style={{
                                    fontSize: '0.95rem',
                                    color: 'white',
                                    fontWeight: 600
                                }}>
                                    info@obu.edu.et
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        © {currentYear} Oda Bultum University. Made with 
                        <Heart size={16} color="#ef4444" fill="#ef4444" />
                        for students
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        fontSize: '0.9rem'
                    }}>
                        <a
                            href="#"
                            style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                textDecoration: 'none',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                textDecoration: 'none',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </footer>
    );
};

export default PremiumFooter;
