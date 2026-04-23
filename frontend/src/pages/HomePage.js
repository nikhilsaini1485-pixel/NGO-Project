import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, X, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = "https://api.healingheartsportsfoundation.org/api"; // Replace with your actual backend URL
const API = "http://0.0.0.0:8000";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
    fetchNews();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API}/activities`);
      setActivities(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API}/news`);
      setNews(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const logoUrl = "https://customer-assets.emergentagent.com/job_helping-hands-ngo/artifacts/i3qfl6uh_WhatsApp%20Image%202026-01-20%20at%207.05.49%20PM%20%283%29.jpeg";

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={logoUrl} alt="HHSF Logo" className="h-14 w-14 object-contain" />
              <div>
                <h1 className="font-heading text-lg font-bold text-primary leading-tight">Healing Heart</h1>
                <p className="text-xs text-text-secondary">Sports Foundation</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-text-primary hover:text-primary transition-colors font-medium">Home</a>
              <a href="#about" className="text-text-primary hover:text-primary transition-colors font-medium">About Us</a>
              <a href="#activities" className="text-text-primary hover:text-primary transition-colors font-medium">Activities</a>
              <a href="#news" className="text-text-primary hover:text-primary transition-colors font-medium">News</a>
              <a href="#donate" className="text-text-primary hover:text-primary transition-colors font-medium">Donate</a>
              <Link to="/login" className="text-text-primary hover:text-primary transition-colors font-medium">Join Us</Link>
              <a href="#contact" className="text-text-primary hover:text-primary transition-colors font-medium">Contact</a>
            </div>

            {/* Mobile Menu Button */}
            <button
              data-testid="mobile-menu-toggle"
              className="md:hidden text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-3">
              <a href="#home" className="block py-2 text-text-primary hover:text-primary transition-colors">Home</a>
              <a href="#about" className="block py-2 text-text-primary hover:text-primary transition-colors">About Us</a>
              <a href="#activities" className="block py-2 text-text-primary hover:text-primary transition-colors">Activities</a>
              <a href="#news" className="block py-2 text-text-primary hover:text-primary transition-colors">News</a>
              <a href="#donate" className="block py-2 text-text-primary hover:text-primary transition-colors">Donate</a>
              <Link to="/login" className="block py-2 text-text-primary hover:text-primary transition-colors">Join Us</Link>
              <a href="#contact" className="block py-2 text-text-primary hover:text-primary transition-colors">Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/8337275/pexels-photo-8337275.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-slide-up">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Serving Humanity Through<br />
              <span className="text-secondary">Sports, Care & Compassion</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Join us in making a difference through health camps, sports activities, animal care, and elder welfare programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                data-testid="join-now-btn"
                onClick={() => navigate("/register")}
                className="btn-primary"
              >
                Join Us Now
              </button>
              <a href="#donate" className="btn-secondary items-center content-center">
                Make a Donation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">About Our NGO</h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Healing Heart Sports Foundation is dedicated to creating positive change in society through 
              comprehensive welfare programs spanning sports, healthcare, animal welfare, and elder care.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="card p-8">
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">Our Mission</h3>
              <p className="text-text-secondary leading-relaxed">
                To empower communities through holistic development initiatives that promote physical wellness, 
                compassionate care for all living beings, and dignity for our elders. We strive to create a 
                healthier, more inclusive society where everyone has access to opportunities for growth and well-being.
              </p>
            </div>
            <div className="card p-8">
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-text-secondary leading-relaxed">
                To build a compassionate society where sports unite people, animals receive care they deserve, 
                children receive proper nutrition, and our elderly are honored with respect and comfort. We envision 
                a future where community welfare is at the heart of all our endeavors.
              </p>
            </div>
          </div>

          {/* Our Focus Areas */}
          <div className="mb-12">
            <h3 className="font-heading text-2xl font-bold text-primary text-center mb-8">Our Focus Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card p-6 text-center hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">Sports Activities</h3>
                <p className="text-text-secondary">
                  Organizing sports events, training programs, and health camps to promote physical fitness 
                  and community bonding through sports.
                </p>
              </div>

              <div className="card p-6 text-center hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">Animal Care</h3>
                <p className="text-text-secondary">
                  Providing shelter, medical treatment, and rehabilitation for stray and injured animals. 
                  Running vaccination drives and adoption programs.
                </p>
              </div>

              <div className="card p-6 text-center hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">Child Feeding</h3>
                <p className="text-text-secondary">
                  Ensuring nutritious meals for underprivileged children. Running meal distribution programs 
                  and nutrition awareness campaigns in communities.
                </p>
              </div>

              <div className="card p-6 text-center hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">Old Age Home</h3>
                <p className="text-text-secondary">
                  Providing care, comfort, and companionship to senior citizens. Organizing health checkups, 
                  recreational activities, and emotional support services.
                </p>
              </div>
            </div>
          </div>

          {/* Our Impact */}
          <div className="bg-accent p-8 rounded-lg mb-12">
            <h3 className="font-heading text-2xl font-bold text-primary text-center mb-8">Our Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">500+</p>
                <p className="text-text-secondary">Members & Volunteers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-secondary mb-2">50+</p>
                <p className="text-text-secondary">Events Organized</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">1000+</p>
                <p className="text-text-secondary">Lives Impacted</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-secondary mb-2">10+</p>
                <p className="text-text-secondary">Partner Organizations</p>
              </div>
            </div>
          </div>

          {/* How We Work */}
          <div className="mb-12">
            <h3 className="font-heading text-2xl font-bold text-primary text-center mb-8">How We Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h4 className="font-heading text-lg font-bold text-primary mb-2">Identify Needs</h4>
                <p className="text-text-secondary text-sm">
                  We conduct community surveys and assessments to identify areas requiring immediate attention and support.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h4 className="font-heading text-lg font-bold text-primary mb-2">Plan & Execute</h4>
                <p className="text-text-secondary text-sm">
                  Our team develops comprehensive action plans and mobilizes resources to implement effective programs.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h4 className="font-heading text-lg font-bold text-primary mb-2">Monitor & Improve</h4>
                <p className="text-text-secondary text-sm">
                  We continuously monitor our initiatives and gather feedback to improve and expand our impact.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-primary text-white p-8 rounded-lg">
            <h3 className="font-heading text-2xl font-bold mb-4">Join Our Mission</h3>
            <p className="text-lg mb-6 opacity-90">
              Be part of the change you want to see. Together, we can create a better tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-accent transition-colors"
              >
                Become a Member
              </button>
              <a href="#donate" className="bg-secondary text-white px-8 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors">
                Support Our Cause
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">Our Activities</h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>

          {activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <div key={activity.id} className="card overflow-hidden hover:shadow-xl transition-all">
                  <img
                    src={activity.image_url || "https://images.pexels.com/photos/6646926/pexels-photo-6646926.jpeg"}
                    alt={activity.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <p className="text-sm text-secondary font-medium mb-2">{new Date(activity.date).toLocaleDateString()}</p>
                    <h3 className="font-heading text-xl font-bold text-primary mb-3">{activity.title}</h3>
                    <p className="text-text-secondary">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary">No activities available at the moment.</p>
          )}
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">Latest News</h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>

          {news.length > 0 ? (
            <div className="space-y-6">
              {news.map((item) => (
                <div key={item.id} className="card p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-secondary font-medium mb-2">{new Date(item.date).toLocaleDateString()}</p>
                      <h3 className="font-heading text-xl font-bold text-primary mb-3">{item.title}</h3>
                      <p className="text-text-secondary">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary">No news available at the moment.</p>
          )}
        </div>
      </section>

      {/* Co-Founder Message */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">Message from Our Co-Founder</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-8"></div>
          <p className="text-lg leading-relaxed mb-6">
            "At Healing Heart Sports Foundation, we believe in the power of community and compassion. Our mission is to create positive change through sports, healthcare, animal welfare, and elder care. Together, we can build a healthier, more compassionate society."
          </p>
          <p className="font-heading text-xl font-bold">- Dr. Toshin</p>
          <p className="text-sm opacity-90">Co-Founder, Healing Heart Sports Foundation</p>
        </div>
      </section>

      {/* Donate Section */}
      <section id="donate" className="py-20 bg-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-6">Support Our Cause</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-8"></div>
          <p className="text-lg text-text-secondary mb-8">
            Your generous donations help us continue our work in serving the community. Every contribution makes a difference.
          </p>
          <button
            data-testid="donate-now-btn"
            onClick={() => navigate("/donor-dashboard")}
            className="btn-primary"
          >
            Donate Now
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">Contact Us</h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Phone</h3>
              <p className="text-text-secondary">7082036886</p>
            </div>

            <div className="card p-8 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Email</h3>
              <p className="text-text-secondary break-all">sportsfoundationhealinghearts@gmail.com</p>
            </div>

            <div className="card p-8 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Address</h3>
              <p className="text-text-secondary">220, 8 Marla, Near BEEO Office, Model Town, Sonipat - 1311001</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src={logoUrl} alt="HHSF Logo" className="h-12 w-12 object-contain" />
                <div>
                  <h3 className="font-heading text-lg font-bold">Healing Heart</h3>
                  <p className="text-sm opacity-90">Sports Foundation</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Serving Humanity through Health Camps, Sports, Animal Care, and Elder Welfare.</p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="opacity-90 hover:opacity-100 transition-opacity">About Us</a></li>
                <li><a href="#activities" className="opacity-90 hover:opacity-100 transition-opacity">Activities</a></li>
                <li><a href="#news" className="opacity-90 hover:opacity-100 transition-opacity">News</a></li>
                <li><a href="#donate" className="opacity-90 hover:opacity-100 transition-opacity">Donate</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/healingheartssportsfoundation?igsh=MW92aW9mbDM2MmdhMQ==" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/share/1747bRnfwK/?mibextid=wwXIfr" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
              <div className="mt-6 text-sm opacity-90">
                <p>DARPAN ID: HR/2025/0900271</p>
                <p>GST: 6AADTH34285RIZZ</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-sm opacity-90">
            <p>&copy; 2025 Healing Heart Sports Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;