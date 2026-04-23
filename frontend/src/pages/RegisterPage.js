import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, ChevronRight, ChevronLeft } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = "https://api.healingheartsportsfoundation.org/api";
const API = "http://localhost:8000/api";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    date_of_birth: "",
    profession: "",
    state: "",
    city: "",
    district: "",
    pincode: "",
    blood_group: "",
    son_of: "",
    aadhaar_number: "",
    profile_photo_url: "",
    mobile_number: "",
    email: "",
    designation: "Member",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.full_name) newErrors.full_name = "Full name is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
      if (!formData.profession) newErrors.profession = "Profession is required";
    }

    if (currentStep === 2) {
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.district) newErrors.district = "District is required";
      if (!formData.pincode) newErrors.pincode = "Pincode is required";
      if (!formData.son_of) newErrors.son_of = "Father's/Mother's name is required";
      if (!formData.aadhaar_number) newErrors.aadhaar_number = "Aadhaar number is required";
    }

    if (currentStep === 3) {
      if (!formData.mobile_number) newErrors.mobile_number = "Mobile number is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.designation) newErrors.designation = "Designation is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (!formData.confirm_password) newErrors.confirm_password = "Please confirm password";
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error("Please fill in all the mandatory fields.");
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handlePayment = async () => {
    if (!validateStep(3)) {
      toast.error("Please fill in all the mandatory fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Register user first
      const { confirm_password, ...registrationData } = formData;
      const response = await axios.post(`${API}/auth/register`, registrationData);

      const { user_id, member_id, access_token, payment_amount } = response.data;

      // Store token temporarily
      localStorage.setItem("temp_token", access_token);

      // Open Razorpay payment
      const options = {
        key: "rzp_test_SHzaovaDdjLGdf", // Test key
        amount: payment_amount * 100, // Amount in paise
        currency: "INR",
        name: "Healing Heart Sports Foundation",
        description: `Registration Fee - ${formData.designation}`,
        image: "https://customer-assets.emergentagent.com/job_helping-hands-ngo/artifacts/i3qfl6uh_WhatsApp%20Image%202026-01-20%20at%207.05.49%20PM%20%283%29.jpeg",
        handler: async (paymentResponse) => {
          try {
            // Verify payment - send as query parameters
            const paymentId = paymentResponse.razorpay_payment_id || "test_payment_" + Date.now();
            const orderId = paymentResponse.razorpay_order_id || "test_order";
            const signature = paymentResponse.razorpay_signature || "test_signature";
            
            await axios.post(
              `${API}/payment/verify?payment_id=${paymentId}&order_id=${orderId}&signature=${signature}&user_id=${user_id}`
            );

            // Move token from temp to permanent
            const token = localStorage.getItem("temp_token");
            localStorage.setItem("token", token);
            localStorage.removeItem("temp_token");
            localStorage.setItem("user", JSON.stringify({ id: user_id, member_id, designation: formData.designation }));

            toast.success("Payment successful! Registration completed.");

            // Redirect to dashboard
            if (formData.designation === "Member") {
              navigate("/member-dashboard");
            } else {
              navigate("/coordinator-dashboard");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.mobile_number,
        },
        theme: {
          color: "#1B4D3E",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logoUrl = "https://customer-assets.emergentagent.com/job_helping-hands-ngo/artifacts/i3qfl6uh_WhatsApp%20Image%202026-01-20%20at%207.05.49%20PM%20%283%29.jpeg";

  const paymentAmount = formData.designation === "Member" ? 200 : 300;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img src={logoUrl} alt="HHSF Logo" className="h-20 w-20 mx-auto mb-4 object-contain" />
            <h2 className="font-heading text-3xl font-bold text-primary">Register with Us</h2>
            <p className="text-text-secondary mt-2">Join Healing Heart Sports Foundation</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex-1 flex items-center ${step >= 1 ? "text-primary" : "text-text-muted"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}>
                  1
                </div>
                <div className="ml-2 text-sm font-medium hidden sm:block">Personal Details</div>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div className={`flex-1 flex items-center ${step >= 2 ? "text-primary" : "text-text-muted"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}>
                  2
                </div>
                <div className="ml-2 text-sm font-medium hidden sm:block">Address & ID</div>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div className={`flex-1 flex items-center ${step >= 3 ? "text-primary" : "text-text-muted"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}>
                  3
                </div>
                <div className="ml-2 text-sm font-medium hidden sm:block">Contact & Payment</div>
              </div>
            </div>
          </div>

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  data-testid="register-full-name"
                  className="input-field"
                  value={formData.full_name}
                  onChange={handleChange}
                />
                {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    data-testid="register-gender"
                    className="input-field"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Date of Birth (DD/MM/YYYY) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    data-testid="register-dob"
                    className="input-field"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                  {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Profession <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="profession"
                  data-testid="register-profession"
                  className="input-field"
                  value={formData.profession}
                  onChange={handleChange}
                />
                {errors.profession && <p className="text-red-500 text-sm mt-1">{errors.profession}</p>}
              </div>

              <div className="flex justify-end">
                <button onClick={nextStep} className="btn-primary flex items-center" data-testid="register-next-step1">
                  Next <ChevronRight className="ml-2" size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Address & ID */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    data-testid="register-state"
                    className="input-field"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    data-testid="register-city"
                    className="input-field"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    data-testid="register-district"
                    className="input-field"
                    value={formData.district}
                    onChange={handleChange}
                  />
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    data-testid="register-pincode"
                    className="input-field"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Blood Group (Optional)
                </label>
                <select
                  name="blood_group"
                  data-testid="register-blood-group"
                  className="input-field"
                  value={formData.blood_group}
                  onChange={handleChange}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  S/O (Son/Daughter of) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="son_of"
                  data-testid="register-son-of"
                  className="input-field"
                  placeholder="Father's or Mother's Name"
                  value={formData.son_of}
                  onChange={handleChange}
                />
                {errors.son_of && <p className="text-red-500 text-sm mt-1">{errors.son_of}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="aadhaar_number"
                  data-testid="register-aadhaar"
                  className="input-field"
                  placeholder="XXXX-XXXX-XXXX"
                  value={formData.aadhaar_number}
                  onChange={handleChange}
                />
                {errors.aadhaar_number && <p className="text-red-500 text-sm mt-1">{errors.aadhaar_number}</p>}
              </div>

              <div className="flex justify-between">
                <button onClick={prevStep} className="btn-secondary flex items-center">
                  <ChevronLeft className="mr-2" size={20} /> Back
                </button>
                <button onClick={nextStep} className="btn-primary flex items-center" data-testid="register-next-step2">
                  Next <ChevronRight className="ml-2" size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact & Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  data-testid="register-mobile"
                  className="input-field"
                  placeholder="10-digit mobile number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                />
                {errors.mobile_number && <p className="text-red-500 text-sm mt-1">{errors.mobile_number}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  data-testid="register-email"
                  className="input-field"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <select
                  name="designation"
                  data-testid="register-designation"
                  className="input-field"
                  value={formData.designation}
                  onChange={handleChange}
                >
                  <option value="Member">Member - ₹200</option>
                  <option value="Coordinator">Coordinator - ₹300</option>
                </select>
                {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    data-testid="register-password"
                    className="input-field pr-10"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-text-muted" /> : <Eye className="h-5 w-5 text-text-muted" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  data-testid="register-confirm-password"
                  className="input-field"
                  placeholder="Re-enter your password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
              </div>

              {/* Payment Summary */}
              <div className="bg-accent p-4 rounded-lg border border-primary/20">
                <h3 className="font-heading text-lg font-bold text-primary mb-2">Payment Summary</h3>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Registration Fee ({formData.designation}):</span>
                  <span className="font-bold text-primary text-xl">₹{paymentAmount}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={prevStep} className="btn-secondary flex items-center">
                  <ChevronLeft className="mr-2" size={20} /> Back
                </button>
                <button
                  onClick={handlePayment}
                  data-testid="register-pay-now-btn"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : `Pay Now ₹${paymentAmount}`}
                </button>
              </div>
            </div>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:text-secondary transition-colors">
                Login here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-text-muted hover:text-primary transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
