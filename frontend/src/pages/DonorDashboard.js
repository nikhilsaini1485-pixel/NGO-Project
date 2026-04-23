import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Heart, FileText, Mail, Phone, MapPin, Home, Award } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = "https://api.healingheartsportsfoundation.org/api";
const API = "http://localhost:8000/api";

const DonorDashboard = () => {
  const [donationAmount, setDonationAmount] = useState("");
  const [donorData, setDonorData] = useState({
    donor_name: "",
    donor_email: "",
    donor_mobile: "",
    donor_address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDonation = async (e) => {
    e.preventDefault();

    if (!donationAmount || donationAmount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    if (!donorData.donor_name || !donorData.donor_email || !donorData.donor_mobile || !donorData.donor_address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Create donation
      // const response = await axios.post(`${API}/donations`, {
      //   ...donorData,
      //   amount: parseInt(donationAmount),
      // });
      const response = await axios.post(`http://localhost:8000/api/donations`, {
        ...donorData,
        amount: parseInt(donationAmount),
      });

      const donationId = response.data.id;

      // Open Razorpay payment
      const options = {
        key: "rzp_live_SIOKijfLfkdlWw",
        amount: parseInt(donationAmount) * 100,
        currency: "INR",
        name: "Healing Heart Sports Foundation",
        description: "Donation",
        image: "https://customer-assets.emergentagent.com/job_helping-hands-ngo/artifacts/i3qfl6uh_WhatsApp%20Image%202026-01-20%20at%207.05.49%20PM%20%283%29.jpeg",
        handler: async (paymentResponse) => {
          try {
            const paymentId = paymentResponse.razorpay_payment_id || "test_donation_" + Date.now();
            
            await axios.post(
              `${API}/donations/${donationId}/verify-payment?payment_id=${paymentId}`
            );

            toast.success("Thank you for your generous donation!");
            
            // Reset form
            setDonationAmount("");
            setDonorData({
              donor_name: "",
              donor_email: "",
              donor_mobile: "",
              donor_address: "",
            });
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: donorData.donor_name,
          email: donorData.donor_email,
          contact: donorData.donor_mobile,
        },
        theme: {
          color: "#1B4D3E",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Donation error:", error);
      toast.error(error.response?.data?.detail || "Failed to process donation");
    } finally {
      setIsLoading(false);
    }
  };

  const logoUrl = "https://customer-assets.emergentagent.com/job_helping-hands-ngo/artifacts/i3qfl6uh_WhatsApp%20Image%202026-01-20%20at%207.05.49%20PM%20%283%29.jpeg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={logoUrl} alt="HHSF Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="font-heading text-lg font-bold text-primary">Healing Heart Sports Foundation</h1>
                <p className="text-xs text-text-secondary">Make a Difference Today</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="btn-secondary flex items-center"
              data-testid="back-home-btn"
            >
              <Home size={18} className="mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">Make a Donation</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Your generous donation helps us continue our work in serving the community through sports, healthcare, animal welfare, and elder care programs.
            </p>
          </div>

          {/* Donation Form */}
          <form onSubmit={handleDonation} className="space-y-6">
            {/* Donor Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading text-xl font-bold text-primary mb-4">Your Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="donor_name"
                    data-testid="donor-name-input"
                    className="input-field"
                    placeholder="Your full name"
                    value={donorData.donor_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="donor_email"
                    data-testid="donor-email-input"
                    className="input-field"
                    placeholder="Enter your email"
                    value={donorData.donor_email}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="donor_mobile"
                    data-testid="donor-mobile-input"
                    className="input-field"
                    placeholder="10-digit mobile number"
                    value={donorData.donor_mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="donor_address"
                    data-testid="donor-address-input"
                    className="input-field"
                    placeholder="Your address"
                    value={donorData.donor_address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Donation Amount */}
            <div className="pb-6">
              <h3 className="font-heading text-xl font-bold text-primary mb-4">Donation Amount</h3>
              
              {/* Suggested Amounts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[500, 1000, 2000, 5000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDonationAmount(amount.toString())}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      donationAmount === amount.toString()
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Or Enter Custom Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">₹</span>
                  <input
                    type="number"
                    data-testid="donation-amount-input"
                    className="input-field"
                    style={{paddingLeft: "2rem"}}
                    placeholder="Enter amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            {donationAmount && (
              <div className="bg-accent p-6 rounded-lg border border-primary/20">
                <h3 className="font-heading text-lg font-bold text-primary mb-2">Donation Summary</h3>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Your Contribution:</span>
                  <span className="font-bold text-primary text-3xl">₹{donationAmount}</span>
                </div>
                <p className="text-sm text-text-muted mt-4">
                  You will receive a donation receipt via email after successful payment.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              data-testid="donate-submit-btn"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? "Processing..." : `Donate ₹${donationAmount || "0"}`}
            </button>
          </form>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-bold text-text-primary mb-1">Official Receipt</h4>
                <p className="text-sm text-text-secondary">Get instant receipt via email</p>
              </div>
              <div>
                <Heart className="w-8 h-8 text-secondary mx-auto mb-2" />
                <h4 className="font-bold text-text-primary mb-1">100% Secure</h4>
                <p className="text-sm text-text-secondary">Safe & encrypted payment</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-bold text-text-primary mb-1">Registered NGO</h4>
                <p className="text-sm text-text-secondary">Govt. Reg. No. 9707</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
          <h3 className="font-heading text-xl font-bold text-primary mb-4">Need Help?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="text-primary" size={20} />
              <span className="text-text-secondary">7082036886</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-primary" size={20} />
              <span className="text-text-secondary break-all">sportsfoundationhealinghearts@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-primary" size={20} />
              <span className="text-text-secondary">220, 8 Marla, Near BEEO Office, Model Town, Sonipat - 1311001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
