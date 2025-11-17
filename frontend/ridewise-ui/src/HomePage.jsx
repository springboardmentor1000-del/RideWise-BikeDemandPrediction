import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ridewiseLogo from './assets/ridewise_logo.png';

function HomePage() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your RideWise AI assistant. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyBdkYks91uCEY2N4nmFaeML9_E5AS29tK4');
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  useEffect(() => {
    console.log('HomePage component mounted!');
  }, []);

  const services = [
    { icon: '🚗', title: 'Daily Predictions', desc: 'Get accurate daily ride demand forecasts', color: '#667eea' },
    { icon: '⏰', title: 'Hourly Analysis', desc: 'Hour-by-hour demand insights', color: '#764ba2' },
    { icon: '🌤️', title: 'Weather Integration', desc: 'Real-time weather-based predictions', color: '#f093fb' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Comprehensive data visualization', color: '#4ecdc4' },
    { icon: '🤖', title: 'AI-Powered', desc: 'Machine learning algorithms', color: '#f5576c' },
    { icon: '📱', title: '24/7 Support', desc: 'Always here to help you', color: '#ffd93d' },
  ];

  const testimonials = [
    { name: 'Rajesh Kumar', role: 'Fleet Manager', photo: '👨‍💼', text: 'RideWise has transformed how we manage our transportation services. The predictions are incredibly accurate!' },
    { name: 'Priya Sharma', role: 'Operations Director', photo: '👩‍💼', text: 'The hourly predictions help us optimize our resources perfectly. Highly recommended!' },
    { name: 'Amit Patel', role: 'Business Owner', photo: '👨‍💻', text: 'Best ride demand prediction platform. The weather integration is a game-changer!' },
  ];

  const projects = [
    { title: 'Mumbai Metro Analysis', img: '🏙️', desc: 'Comprehensive ride demand study', category: 'Metro' },
    { title: 'Pune City Bikes', img: '🚲', desc: 'Bicycle sharing optimization', category: 'Bikes' },
    { title: 'Delhi Auto Rickshaws', img: '🛺', desc: 'Auto demand forecasting', category: 'Auto' },
    { title: 'Bangalore Cabs', img: '🚕', desc: 'Taxi fleet management', category: 'Cabs' },
  ];

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const sendMessage = async () => {
    if (chatMessage.trim()) {
      // Add user message
      const userMessage = { type: 'user', text: chatMessage };
      setMessages(prev => [...prev, userMessage]);
      setChatMessage('');
      setIsTyping(true);

      try {
        // Create context about RideWise
        const context = `You are a helpful AI assistant for RideWise, a ride demand prediction platform. 
        RideWise offers: Daily ride predictions, Hourly analysis, Weather-based forecasting, Analytics dashboard, and AI-powered insights.
        Answer user questions about our services, features, and how we can help with ride demand forecasting.
        
        User question: ${chatMessage}`;

        const result = await model.generateContent(context);
        const response = await result.response;
        const botReply = response.text();

        // Add bot response
        setMessages(prev => [...prev, { type: 'bot', text: botReply }]);
      } catch (error) {
        console.error('Gemini API Error:', error);
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Sorry, I encountered an error. Please try again or contact our support team at support@ridewise.com' 
        }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: '#1a1a2e' }}>
      {/* Header/Navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '15px 0',
        boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <img src={ridewiseLogo} alt="RideWise" style={{ width: '50px', height: '50px', borderRadius: '10px' }} />
            <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white' }}>RideWise</span>
          </div>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <a href="#home" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Home</a>
            <a href="#about" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>About Us</a>
            <a href="#services" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Services</a>
            <a href="#projects" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Projects</a>
            <a href="#testimonials" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Testimonials</a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Contact</a>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={handleGetStarted} style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              padding: '10px 24px',
              borderRadius: '25px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#667eea';}}
            onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'white';}}>
              Login
            </button>
            <button onClick={handleSignup} style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
            }}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '100px 30px',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '20px', textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            Predict Ride Demand<br />According to Your Plan
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '40px', opacity: 0.95 }}>
            AI-powered ride demand forecasting for smarter transportation planning
          </p>
          <button onClick={handleGetStarted} style={{
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            padding: '18px 50px',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '1.2rem',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(255,107,107,0.4)',
            transition: 'transform 0.3s ease',
          }}>
            Get Started
          </button>

          {/* Service Icons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '60px', flexWrap: 'wrap' }}>
            {['🚗 Daily', '⏰ Hourly', '🌤️ Weather', '📊 Analytics', '🤖 AI'].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '30px',
                borderRadius: '25px',
                border: '2px solid rgba(255,255,255,0.3)',
                minWidth: '150px',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{item.split(' ')[0]}</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{item.split(' ')[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '80px 30px', background: '#f7f9fc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '15px' }}>About Us</h2>
            <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
              We provide cutting-edge AI solutions for transportation demand forecasting
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#667eea' }}>Our Mission</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.8' }}>
                To revolutionize transportation planning with accurate, real-time ride demand predictions powered by advanced machine learning.
              </p>
            </div>
            <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👁️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#764ba2' }}>Our Vision</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.8' }}>
                To become the leading platform for intelligent transportation management, making cities smarter and more efficient.
              </p>
            </div>
            <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚡</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#f093fb' }}>Our Values</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.8' }}>
                Innovation, accuracy, and customer satisfaction drive everything we do. We're committed to excellence in every prediction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '80px 30px', background: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '15px' }}>Our Services</h2>
            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              Comprehensive solutions for all your ride demand forecasting needs
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {services.map((service, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                border: `3px solid ${service.color}15`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = `0 20px 60px ${service.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
              }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px', color: service.color }}>{service.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Projects Section */}
      <section id="projects" style={{ padding: '80px 30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '15px' }}>Latest Projects</h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
              Explore our successful ride demand prediction implementations
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {projects.map((project, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem',
                }}>
                  {project.img}
                </div>
                <div style={{ padding: '25px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '5px 15px',
                    background: '#667eea20',
                    color: '#667eea',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '10px',
                  }}>
                    {project.category}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px', color: '#1a1a2e' }}>{project.title}</h3>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ padding: '80px 30px', background: '#f7f9fc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '15px' }}>What Our Customers Say</h2>
            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              Real feedback from satisfied clients
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                position: 'relative',
              }}>
                <div style={{ fontSize: '3rem', color: '#667eea', marginBottom: '20px' }}>❝</div>
                <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.8', marginBottom: '25px', fontStyle: 'italic' }}>
                  {testimonial.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                  }}>
                    {testimonial.photo}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '1.1rem' }}>{testimonial.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '80px 30px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '15px' }}>Contact Us</h2>
            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              Get in touch with our team
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '30px', color: '#667eea' }}>Send us a message</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input type="text" placeholder="Your Name" style={{
                  padding: '15px 20px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }} />
                <input type="email" placeholder="Your Email" style={{
                  padding: '15px 20px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }} />
                <textarea placeholder="Your Message" rows="5" style={{
                  padding: '15px 20px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}></textarea>
                <button style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 40px',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                }}>
                  Send Message
                </button>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '30px', color: '#764ba2' }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#667eea20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>📞</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '5px' }}>Call Us</div>
                    <div style={{ color: '#6b7280' }}>+91 98765 43210</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#764ba220',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>📧</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '5px' }}>Email Us</div>
                    <div style={{ color: '#6b7280' }}>info@ridewise.com</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#f093fb20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>📍</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '5px' }}>Visit Us</div>
                    <div style={{ color: '#6b7280' }}>Pune, Maharashtra, India</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#4ecdc420',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>🕐</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '5px' }}>Working Hours</div>
                    <div style={{ color: '#6b7280' }}>Mon - Fri: 9AM - 6PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a2e', color: 'white', padding: '60px 30px 30px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <img src={ridewiseLogo} alt="RideWise" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>RideWise</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
                AI-powered ride demand forecasting for smarter transportation planning.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="#home" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</a>
                <a href="#about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>About</a>
                <a href="#services" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Services</a>
                <a href="#contact" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Contact</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '15px' }}>
                {['📘', '📷', '🐦', '💼'].map((icon, i) => (
                  <div key={i} style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <p>© 2025 RideWise. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      {chatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          width: '350px',
          height: '450px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            padding: '20px',
            borderRadius: '20px 20px 0 0',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>🤖 RideWise AI Assistant</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Powered by Gemini AI</div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}>×</button>
          </div>
          <div style={{ 
            flex: 1, 
            padding: '20px', 
            overflowY: 'auto', 
            background: '#f7f9fc',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  background: msg.type === 'user' 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : 'white',
                  color: msg.type === 'user' ? 'white' : '#333',
                  padding: '12px 16px',
                  borderRadius: msg.type === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                  maxWidth: '80%',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  wordWrap: 'break-word',
                  lineHeight: '1.5',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}>
                <div style={{
                  background: 'white',
                  padding: '12px 16px',
                  borderRadius: '15px 15px 15px 0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <span style={{ animation: 'pulse 1.5s infinite' }}>●</span>
                    <span style={{ animation: 'pulse 1.5s infinite 0.3s' }}>●</span>
                    <span style={{ animation: 'pulse 1.5s infinite 0.6s' }}>●</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: '15px', background: 'white', borderRadius: '0 0 20px 20px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about RideWise..."
                disabled={isTyping}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '25px',
                  border: '2px solid #e2e8f0',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <button onClick={sendMessage} disabled={isTyping} style={{
                background: isTyping ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                color: 'white',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button onClick={() => setChatOpen(!chatOpen)} style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        color: 'white',
        fontSize: '1.8rem',
        cursor: 'pointer',
        boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
        zIndex: 9999,
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        💬
      </button>

      {/* Add CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
