// CoordinatorDashboard is identical to MemberDashboard except the title
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  User,
  FileText,
  CreditCard,
  IdCard,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Award,
  Heart,
  Edit,
  X,
  Menu,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = "https://api.healingheartsportsfoundation.org/api";
const API = "http://localhost:8000/api";

const CoordinatorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [enquiryData, setEnquiryData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    mobile_number: "",
    profession: "",
    blood_group: "",
  });
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Close sidebar on tab selection (mobile)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === "donations" && user) {
      fetchDonations();
    }
  }, [activeTab, user]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      setEnquiryData({
        name: response.data.full_name,
        email: response.data.email,
        message: "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await axios.get(`${API}/donations/user/${user.email}`);
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API}/enquiries`, enquiryData);
      toast.success("Enquiry submitted successfully!");
      setEnquiryData({ ...enquiryData, message: "" });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditFormData({
      mobile_number: user.mobile_number,
      profession: user.profession,
      blood_group: user.blood_group || "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(editFormData).toString();
      await axios.put(
        `${API}/auth/update-profile?${params}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchUserData(); // Refresh user data
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalDonations = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0,
  );

  const logoUrl =
    "https://customer-assets.emergentagent.com/job_helping-hands-ngo/artifacts/i3qfl6uh_WhatsApp%20Image%202026-01-20%20at%207.05.49%20PM%20%283%29.jpeg";

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-30 w-64 bg-primary text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:z-auto md:flex
          ${sidebarOpen ? "translate-x-0 h-full" : "-translate-x-full"}
        `}
      >
        {/* Logo + Close button */}
        <div className="p-6 flex items-center justify-between border-b border-white/20">
          <div className="flex items-center space-x-3">
            {/* Replace with your actual logo */}
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
              H
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold">HHSF</h2>
              <p className="text-xs opacity-90">Admin Panel</p>
            </div>
          </div>
          {/* Close icon — only visible on mobile */}
          <button
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 flex items-center space-x-3 border-b border-white/20">
          <img
            src={logoUrl}
            alt="HHSF Logo"
            className="h-12 w-12 object-contain"
          />
          <div>
            <h2 className="font-heading text-lg font-bold">HHSF</h2>
            <p className="text-xs opacity-90">Coordinator Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            data-testid="dashboard-profile-tab"
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "profile" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <User size={20} />
            <span>Profile</span>
          </button>

          <button
            data-testid="dashboard-receipt-tab"
            onClick={() => setActiveTab("receipt")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "receipt" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <FileText size={20} />
            <span>Receipt</span>
          </button>

          <button
            data-testid="dashboard-idcard-tab"
            onClick={() => setActiveTab("idcard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "idcard" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <IdCard size={20} />
            <span>Coordinator ID Card</span>
          </button>

          <button
            data-testid="dashboard-certificate-tab"
            onClick={() => setActiveTab("certificate")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "certificate" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Award size={20} />
            <span>Certificate</span>
          </button>

          <button
            data-testid="dashboard-donations-tab"
            onClick={() => setActiveTab("donations")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "donations" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Heart size={20} />
            <span>Donation History</span>
          </button>

          <button
            data-testid="dashboard-enquiry-tab"
            onClick={() => setActiveTab("enquiry")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "enquiry" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Mail size={20} />
            <span>Enquiry</span>
          </button>

          <button
            data-testid="dashboard-contact-tab"
            onClick={() => setActiveTab("contact")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "contact" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Phone size={20} />
            <span>Contact Us</span>
          </button>
        </nav>

        <button
          data-testid="dashboard-logout-btn"
          onClick={handleLogout}
          className="m-4 flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors border border-white/20"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content - Same as Member Dashboard */}
      <div className="flex-1 p-8">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center gap-3 bg-primary text-white px-4 py-3 sticky top-0 z-10 shadow mb-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="text-white hover:text-white/80 transition-colors"
          >
            <Menu size={24} />
          </button>
          <h2 className="font-bold text-base">HHSF Admin</h2>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-primary">
              Welcome, {user.full_name}
            </h1>
            <p className="text-text-secondary">
              Coordinator ID: {user.member_id}
            </p>
          </div>

          {/* Same content structure as MemberDashboard */}
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-primary">
                  My Profile
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEditProfile}
                    className="btn-secondary flex items-center"
                    data-testid="profile-edit-btn"
                  >
                    <Edit size={18} className="mr-2" />
                    Update Profile
                  </button>
                ) : (
                  <button onClick={handleCancelEdit} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="input-field"
                        value={editFormData.mobile_number}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            mobile_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Profession
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={editFormData.profession}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            profession: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Blood Group
                      </label>
                      <select
                        className="input-field"
                        value={editFormData.blood_group}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            blood_group: e.target.value,
                          })
                        }
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
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary disabled:opacity-50"
                    data-testid="profile-save-btn"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Full Name
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.full_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Coordinator ID
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.member_id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Email
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Mobile Number
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.mobile_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Gender
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.gender}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Date of Birth
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.date_of_birth}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Profession
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.profession}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Blood Group
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.blood_group || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      State
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.state}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      City
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.city}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      District
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.district}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Pincode
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.pincode}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      S/O
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.son_of}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Aadhaar Number
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.aadhaar_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Designation
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {user.designation}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Registration Date
                    </label>
                    <p className="text-text-primary font-medium mt-1">
                      {new Date(user.registration_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "receipt" && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                Payment Receipt
              </h2>
              <div className="bg-accent p-6 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Payment Amount
                    </label>
                    <p className="text-text-primary font-bold text-2xl mt-1">
                      ₹{user.payment_amount}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">
                      Payment Status
                    </label>
                    <p className="text-secondary font-bold text-lg mt-1">
                      {user.receipt_url ? "Completed" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
              {user.receipt_url ? (
                <div className="flex gap-4">
                  <a
                    href={`${API}/download/receipt/${user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    data-testid="view-receipt-btn"
                  >
                    View Receipt
                  </a>
                  <a
                    href={`${API}/download/receipt/${user.id}`}
                    download
                    className="btn-secondary"
                    data-testid="download-receipt-btn"
                  >
                    Download Receipt
                  </a>
                </div>
              ) : (
                <p className="text-text-muted">
                  Complete payment to view receipt
                </p>
              )}
            </div>
          )}

          {activeTab === "idcard" && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                Coordinator ID Card
              </h2>
              <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-lg text-white mb-6 max-w-md mx-auto">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={logoUrl}
                    alt="HHSF Logo"
                    className="h-16 w-16 object-contain bg-white rounded-full p-2"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-lg">
                      Healing Heart Sports Foundation
                    </h3>
                    <p className="text-sm opacity-90">Coordinator ID Card</p>
                  </div>
                </div>
                <div className="border-t border-white/30 pt-4 space-y-2">
                  <p className="font-bold text-xl">{user.full_name}</p>
                  <p className="text-sm">ID: {user.member_id}</p>
                  <p className="text-sm">
                    Blood Group: {user.blood_group || "N/A"}
                  </p>
                  <p className="text-sm">Mobile: {user.mobile_number}</p>
                </div>
              </div>
              {user.id_card_url ? (
                <div className="flex gap-4 justify-center">
                  <a
                    href={`${API}/download/idcard/${user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    data-testid="view-idcard-btn"
                  >
                    View ID Card
                  </a>
                  <a
                    href={`${API}/download/idcard/${user.id}`}
                    download
                    className="btn-secondary"
                    data-testid="download-idcard-btn"
                  >
                    Download ID Card
                  </a>
                </div>
              ) : (
                <p className="text-center text-text-muted">
                  Complete payment to view ID card
                </p>
              )}
            </div>
          )}

          {activeTab === "certificate" && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                Coordinator Certificate
              </h2>
              <div className="bg-accent p-8 rounded-lg mb-6 text-center border-4 border-primary/20">
                <img
                  src={logoUrl}
                  alt="HHSF Logo"
                  className="h-24 w-24 mx-auto mb-4 object-contain"
                />
                <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                  Healing Heart Sports Foundation
                </h3>
                <p className="text-lg font-bold text-secondary mb-4">
                  Certificate of Appreciation
                </p>
                <p className="text-text-secondary mb-4">
                  This certificate is proudly presented to
                </p>
                <p className="font-heading text-3xl font-bold text-primary mb-6">
                  {user.full_name}
                </p>
                <p className="text-text-secondary">
                  In recognition and sincere gratitude for your generous
                  contribution to support our initiatives
                </p>
              </div>
              {user.certificate_url ? (
                <div className="flex gap-4 justify-center">
                  <a
                    href={`${API}/download/certificate/${user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    data-testid="view-certificate-btn"
                  >
                    View Certificate
                  </a>
                  <a
                    href={`${API}/download/certificate/${user.id}`}
                    download
                    className="btn-secondary"
                    data-testid="download-certificate-btn"
                  >
                    Download Certificate
                  </a>
                </div>
              ) : (
                <p className="text-center text-text-muted">
                  Complete payment to view certificate
                </p>
              )}
            </div>
          )}

          {activeTab === "donations" && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                Donation History
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-accent p-6 rounded-lg">
                  <p className="text-sm font-medium text-text-muted mb-2">
                    Total Donations
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {donations.length}
                  </p>
                </div>
                <div className="bg-accent p-6 rounded-lg">
                  <p className="text-sm font-medium text-text-muted mb-2">
                    Total Amount
                  </p>
                  <p className="text-3xl font-bold text-secondary">
                    ₹{totalDonations}
                  </p>
                </div>
              </div>

              {donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-primary">
                            ₹{donation.amount}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {new Date(
                              donation.donation_date,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                           <a
                          href={`${API}/download/donation-receipt/${donations.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm text-primary hover:text-secondary transition-colors"
                          data-testid="view-certificate-btn"
                        >
                          View Receipt
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-text-secondary py-8">
                  No donations yet
                </p>
              )}
            </div>
          )}

          {activeTab === "enquiry" && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                Submit Enquiry
              </h2>
              <form onSubmit={handleEnquiry} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    data-testid="enquiry-name-input"
                    className="input-field"
                    value={enquiryData.name}
                    onChange={(e) =>
                      setEnquiryData({ ...enquiryData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    data-testid="enquiry-email-input"
                    className="input-field"
                    value={enquiryData.email}
                    onChange={(e) =>
                      setEnquiryData({ ...enquiryData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Your Message
                  </label>
                  <textarea
                    data-testid="enquiry-message-input"
                    className="input-field"
                    rows="5"
                    value={enquiryData.message}
                    onChange={(e) =>
                      setEnquiryData({
                        ...enquiryData,
                        message: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  data-testid="enquiry-submit-btn"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Submitting..." : "Submit Enquiry"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      Phone Number
                    </h3>
                    <p className="text-text-secondary">7082036886</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      Email Address
                    </h3>
                    <p className="text-text-secondary break-all">
                      sportsfoundationhealinghearts@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">Address</h3>
                    <p className="text-text-secondary">
                      220, 8 Marla, Near BEEO Office, Model Town, Sonipat -
                      1311001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;