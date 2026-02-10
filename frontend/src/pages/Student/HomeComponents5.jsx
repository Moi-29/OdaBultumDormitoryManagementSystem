import { forwardRef } from 'react';
import { Building2, CreditCard, TrendingUp, Users, CheckCircle, ArrowRight, Home, Bed, Shield } from 'lucide-react';

// Dormitory Availability Section
export const DormitoryAvailability = forwardRef(({ visible }, ref) => (
    <div 
        ref={ref}
        data-section="dorm"
        style={{
            padding: '8rem 2rem',
            background: 'white',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.9s'
        }}
    >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#4F46E515',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    marginBottom: '1.5rem'
                }}>
                    <Building2 size={20} color="#10b981" />
                    <span style={{ color: '#4F46E5', fontWeight: 700 }}>Housing Information</span>
                </div>
                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 800,
                    color: '#1f2937',
                    marginBottom: '1rem'
                }}>
                    Dormitory Availability
                </h2>
                <p style={{
                    fontSize: '1.2rem',
                    color: '#6b7280',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Current semester housing status and information
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem'
            }}>
                {[
                    { label: 'Total Capacity', value: '6,000', icon: Building2, color: '#4F46E5' },
                    { label: 'Current Occupancy', value: '5,100', icon: Users, color: '#8B5CF6' },
                    { label: 'Occupancy Rate', value: '85%', icon: TrendingUp, color: '#F59E0B' }
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} style={{
                            background: `linear-gradient(135deg, ${stat.color}10 0%, ${stat.color}05 100%)`,
                            borderRadius: '20px',
                            padding: '2.5rem',
                            border: `2px solid ${stat.color}30`,
                            textAlign: 'center',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = `0 10px 30px ${stat.color}30`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                background: stat.color,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Icon size={32} color="white" strokeWidth={2.5} />
                            </div>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: '#1f2937',
                                marginBottom: '0.5rem'
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                color: '#6b7280',
                                fontWeight: 600
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Dormitory Blocks Info */}
            <div style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                borderRadius: '24px',
                padding: '3rem',
                border: '2px solid #e5e7eb'
            }}>
                <h3 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <Home size={28} color="#4F46E5" />
                    Available Dormitory Blocks
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {[
                        { name: 'Block A', rooms: 120, type: 'Male', status: 'Available' },
                        { name: 'Block B', rooms: 115, type: 'Male', status: 'Available' },
                        { name: 'Block C', rooms: 100, type: 'Female', status: 'Available' },
                        { name: 'Block D', rooms: 110, type: 'Female', status: 'Available' },
                        { name: 'Block E', rooms: 95, type: 'Male', status: 'Limited' },
                        { name: 'Building I', rooms: 150, type: 'Male', status: 'Available' },
                        { name: 'Building II', rooms: 140, type: 'Female', status: 'Available' },
                        { name: 'Building III', rooms: 130, type: 'Male', status: 'Full' }
                    ].map((block, i) => (
                        <div key={i} style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '2px solid #e5e7eb',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#4F46E5';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '1rem'
                            }}>
                                <h4 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: '#1f2937',
                                    margin: 0
                                }}>
                                    {block.name}
                                </h4>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '50px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    background: block.status === 'Available' ? '#4F46E515' : 
                                               block.status === 'Limited' ? '#F59E0B15' : '#F43F5E15',
                                    color: block.status === 'Available' ? '#4F46E5' : 
                                           block.status === 'Limited' ? '#F59E0B' : '#F43F5E'
                                }}>
                                    {block.status}
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#6b7280',
                                fontSize: '0.9rem',
                                marginBottom: '0.5rem'
                            }}>
                                <Bed size={16} />
                                <span>{block.rooms} Rooms</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#6b7280',
                                fontSize: '0.9rem'
                            }}>
                                <Users size={16} />
                                <span>{block.type} Students</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
));


// Meal Card Section
export const MealCardSection = forwardRef(({ visible }, ref) => (
    <div 
        ref={ref}
        data-section="meal"
        style={{
            padding: '8rem 2rem',
            background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 1s'
        }}
    >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#8B5CF615',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    marginBottom: '1.5rem'
                }}>
                    <CreditCard size={20} color="#3b82f6" />
                    <span style={{ color: '#8B5CF6', fontWeight: 700 }}>Meal Services</span>
                </div>
                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 800,
                    color: '#1f2937',
                    marginBottom: '1rem'
                }}>
                    Meal Card Information
                </h2>
                <p style={{
                    fontSize: '1.2rem',
                    color: '#6b7280',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Everything you need to know about campus meal services
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
            }}>
                {/* How to Get Meal Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '3rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '2px solid #e5e7eb',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem'
                    }}>
                        <CreditCard size={32} color="white" strokeWidth={2.5} />
                    </div>
                    <h3 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        marginBottom: '1.5rem'
                    }}>
                        How to Get Your Meal Card
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                    }}>
                        {[
                            'Visit the Student Services Office',
                            'Bring your student ID and registration proof',
                            'Pay the semester meal fee',
                            'Receive your activated meal card',
                            'Start using it immediately at any cafeteria'
                        ].map((step, i) => (
                            <li key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                marginBottom: '1rem',
                                padding: '1rem',
                                background: '#f8f9fa',
                                borderRadius: '12px'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    background: '#8B5CF6',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.85rem'
                                }}>
                                    {i + 1}
                                </div>
                                <span style={{
                                    fontSize: '1rem',
                                    color: '#4b5563',
                                    lineHeight: 1.6
                                }}>
                                    {step}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Meal Card Benefits */}
                <div style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                    borderRadius: '24px',
                    padding: '3rem',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
                }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem'
                    }}>
                        <CheckCircle size={32} color="white" strokeWidth={2.5} />
                    </div>
                    <h3 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        marginBottom: '1.5rem'
                    }}>
                        Meal Card Benefits
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                    }}>
                        {[
                            'Access to all campus cafeterias',
                            'Discounted meal prices for students',
                            'No need to carry cash',
                            'Track your meal expenses online',
                            'Reload anytime at service centers',
                            'Valid for the entire semester'
                        ].map((benefit, i) => (
                            <li key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1rem',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <CheckCircle size={20} color="white" strokeWidth={2.5} />
                                <span style={{
                                    fontSize: '1rem',
                                    lineHeight: 1.6
                                }}>
                                    {benefit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Important Notes */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '3rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '2px solid #e5e7eb',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem'
                    }}>
                        <Shield size={32} color="white" strokeWidth={2.5} />
                    </div>
                    <h3 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        marginBottom: '1.5rem'
                    }}>
                        Important Notes
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                    }}>
                        {[
                            'Keep your meal card safe - it\'s non-transferable',
                            'Report lost cards immediately to prevent misuse',
                            'Replacement fee applies for lost cards',
                            'Check your balance regularly',
                            'Meal cards expire at semester end',
                            'Unused balance can be refunded'
                        ].map((note, i) => (
                            <li key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                marginBottom: '1rem',
                                padding: '1rem',
                                background: '#fef3c7',
                                borderRadius: '12px',
                                border: '1px solid #fbbf24'
                            }}>
                                <ArrowRight size={20} color="#d97706" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span style={{
                                    fontSize: '1rem',
                                    color: '#78350f',
                                    lineHeight: 1.6
                                }}>
                                    {note}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Contact Information */}
            <div style={{
                marginTop: '3rem',
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem',
                textAlign: 'center',
                border: '2px solid #e5e7eb'
            }}>
                <h4 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: '1rem'
                }}>
                    Need Help with Your Meal Card?
                </h4>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#6b7280',
                    marginBottom: '1.5rem'
                }}>
                    Visit the Student Services Office or contact us
                </p>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        padding: '1rem 2rem',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        fontWeight: 600,
                        color: '#1f2937'
                    }}>
                        📞 +251-911-000-000
                    </div>
                    <div style={{
                        padding: '1rem 2rem',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        fontWeight: 600,
                        color: '#1f2937'
                    }}>
                        📧 mealcard@obu.edu.et
                    </div>
                </div>
            </div>
        </div>
    </div>
));
