import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Users,
  FileText,
  Newspaper,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Heart,
  DollarSign,
  Download,
  Search,
  Ban,
  CheckCircle,
  X,
  Menu,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = "https://api.healingheartsportsfoundation.org/api";
const API = "http://localhost:8000/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [members, setMembers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [financeData, setFinanceData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const [activityForm, setActivityForm] = useState({
    title: "",
    description: "",
    image_url: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.designation !== "Admin") {
      toast.error("Unauthorized access");
      navigate("/login");
      return;
    }

    if (activeTab === "members") {
      fetchMembers();
    } else if (activeTab === "donors") {
      fetchDonors();
    } else if (activeTab === "finance") {
      fetchFinanceData();
      fetchTransactions();
    } else if (activeTab === "activities") {
      fetchActivities();
    } else if (activeTab === "news") {
      fetchNews();
    }
  }, [activeTab, navigate]);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/admin/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API}/activities`);
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API}/news`);
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/admin/donors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonors(response.data);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/admin/finance/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFinanceData(response.data);
    } catch (error) {
      console.error("Error fetching finance data:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/admin/finance/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleBlockDonor = async (donorEmail) => {
    if (!window.confirm(`Are you sure you want to block ${donorEmail}?`))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/admin/donors/${donorEmail}/block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Donor blocked successfully");
      fetchDonors();
    } catch (error) {
      console.error("Error blocking donor:", error);
      toast.error("Failed to block donor");
    }
  };

  const handleUnblockDonor = async (donorEmail) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/admin/donors/${donorEmail}/unblock`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Donor unblocked successfully");
      fetchDonors();
    } catch (error) {
      console.error("Error unblocking donor:", error);
      toast.error("Failed to unblock donor");
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/admin/finance/export-csv`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `transactions_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Transactions exported successfully");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export transactions");
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/activities`, activityForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Activity added successfully!");
      setShowAddActivity(false);
      setActivityForm({
        title: "",
        description: "",
        image_url: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchActivities();
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Failed to add activity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/news`, newsForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("News added successfully!");
      setShowAddNews(false);
      setNewsForm({
        title: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchNews();
    } catch (error) {
      console.error("Error adding news:", error);
      toast.error("Failed to add news");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

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
            <p className="text-xs opacity-90">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            data-testid="admin-members-tab"
            onClick={() => setActiveTab("members")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "members" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Users size={20} />
            <span>Members</span>
          </button>

          <button
            data-testid="admin-donors-tab"
            onClick={() => setActiveTab("donors")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "donors" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Heart size={20} />
            <span>Donors</span>
          </button>

          <button
            data-testid="admin-finance-tab"
            onClick={() => setActiveTab("finance")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "finance" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <DollarSign size={20} />
            <span>Finance</span>
          </button>

          <button
            data-testid="admin-activities-tab"
            onClick={() => setActiveTab("activities")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "activities" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <FileText size={20} />
            <span>Activities</span>
          </button>

          <button
            data-testid="admin-news-tab"
            onClick={() => setActiveTab("news")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "news" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Newspaper size={20} />
            <span>News</span>
          </button>
        </nav>

        <button
          data-testid="admin-logout-btn"
          onClick={handleLogout}
          className="m-4 flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors border border-white/20"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col min-w-0">
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

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h1 className="font-heading md:text-3xl font-bold text-primary">
                Admin Dashboard
              </h1>
              <p className="text-text-secondary text-sm md:text-base">Manage your NGO content</p>
            </div>

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="card p-4 md:p-6 bg-white rounded-xl shadow">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-primary mb-6">
                  Registered Members & Coordinators
                </h2>

                {members.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-text-primary">
                            Name
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-text-primary">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-text-primary">
                            Mobile
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-text-primary">
                            Designation
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-text-primary">
                            Member ID
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-text-primary">
                            Registration Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member) => (
                          <tr
                            key={member.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">{member.full_name}</td>
                            <td className="py-3 px-4">{member.email}</td>
                            <td className="py-3 px-4">
                              {member.mobile_number}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  member.designation === "Member"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {member.designation}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-sm">
                              {member.member_id}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(
                                member.registration_date,
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-text-secondary py-8">
                    No members registered yet
                  </p>
                )}
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === "activities" && (
              <div className="card p-4 md:p-6 bg-white rounded-xl shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-primary">
                    Manage Activities
                  </h2>
                  <button
                    data-testid="add-activity-btn"
                    onClick={() => setShowAddActivity(!showAddActivity)}
                    className="btn-primary flex items-center"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Activity
                  </button>
                </div>

                {showAddActivity && (
                  <form
                    onSubmit={handleAddActivity}
                    className="bg-accent p-6 rounded-lg mb-6"
                  >
                    <h3 className="font-bold text-primary mb-4">
                      Add New Activity
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          data-testid="activity-title-input"
                          className="input-field"
                          value={activityForm.title}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Description
                        </label>
                        <textarea
                          data-testid="activity-description-input"
                          className="input-field"
                          rows="3"
                          value={activityForm.description}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              description: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Activity Image (JPG/PNG)
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          data-testid="activity-image-input"
                          className="input-field"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              // Convert to base64 or upload to server
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setActivityForm({
                                  ...activityForm,
                                  image_url: reader.result,
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          required
                        />
                        <p className="text-xs text-text-muted mt-1">
                          Upload JPG or PNG image (max 5MB)
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          data-testid="activity-date-input"
                          className="input-field"
                          value={activityForm.date}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              date: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn-primary disabled:opacity-50"
                        >
                          {isLoading ? "Adding..." : "Add Activity"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddActivity(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          {activity.image_url && (
                            <img
                              src={activity.image_url}
                              alt={activity.title}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-primary mb-2">
                              {activity.title}
                            </h3>
                            <p className="text-text-secondary text-sm mb-2">
                              {activity.description}
                            </p>
                            <p className="text-sm text-secondary font-medium">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-text-secondary py-8">
                    No activities added yet
                  </p>
                )}
              </div>
            )}

            {/* News Tab */}
            {activeTab === "news" && (
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-2xl font-bold text-primary">
                    Manage News
                  </h2>
                  <button
                    data-testid="add-news-btn"
                    onClick={() => setShowAddNews(!showAddNews)}
                    className="btn-primary flex items-center"
                  >
                    <Plus size={18} className="mr-2" />
                    Add News
                  </button>
                </div>

                {showAddNews && (
                  <form
                    onSubmit={handleAddNews}
                    className="bg-accent p-6 rounded-lg mb-6"
                  >
                    <h3 className="font-bold text-primary mb-4">
                      Add News Item
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          data-testid="news-title-input"
                          className="input-field"
                          value={newsForm.title}
                          onChange={(e) =>
                            setNewsForm({ ...newsForm, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Content
                        </label>
                        <textarea
                          data-testid="news-content-input"
                          className="input-field"
                          rows="4"
                          value={newsForm.content}
                          onChange={(e) =>
                            setNewsForm({
                              ...newsForm,
                              content: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          data-testid="news-date-input"
                          className="input-field"
                          value={newsForm.date}
                          onChange={(e) =>
                            setNewsForm({ ...newsForm, date: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn-primary disabled:opacity-50"
                        >
                          {isLoading ? "Adding..." : "Add News"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddNews(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {news.length > 0 ? (
                  <div className="space-y-4">
                    {news.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-bold text-primary mb-2">
                          {item.title}
                        </h3>
                        <p className="text-text-secondary text-sm mb-2">
                          {item.content}
                        </p>
                        <p className="text-sm text-secondary font-medium">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-text-secondary py-8">
                    No news added yet
                  </p>
                )}
              </div>
            )}

            {/* Donors Tab */}
            {activeTab === "donors" && (
              <div className="card p-6">
                <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                  Donor Management
                </h2>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search donors by name, email, or mobile..."
                      className="input-field pl-10"
                      style={{ paddingLeft: "2.5rem" }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {donors.length > 0 ? (
                  <div className="space-y-4">
                    {donors
                      .filter(
                        (donor) =>
                          donor.donor_name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          donor.donor_email
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          donor.donor_mobile.includes(searchQuery),
                      )
                      .map((donor) => (
                        <div
                          key={donor.donor_email}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-heading text-xl font-bold text-primary">
                                  {donor.donor_name}
                                </h3>
                                {donor.status === "blocked" && (
                                  <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Blocked
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-text-muted">
                                    Email:
                                  </span>{" "}
                                  <span className="text-text-primary font-medium">
                                    {donor.donor_email}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-text-muted">
                                    Mobile:
                                  </span>{" "}
                                  <span className="text-text-primary font-medium">
                                    {donor.donor_mobile}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-text-muted">
                                    Total Donations:
                                  </span>{" "}
                                  <span className="text-secondary font-bold">
                                    {donor.total_donations}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-text-muted">
                                    Total Amount:
                                  </span>{" "}
                                  <span className="text-primary font-bold text-lg">
                                    ₹{donor.total_amount.toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              {/* Recent Donations */}
                              {donor.donations.length > 0 && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-text-muted mb-2">
                                    Recent Donations:
                                  </p>
                                  <div className="space-y-1">
                                    {donor.donations
                                      .slice(0, 3)
                                      .map((donation) => (
                                        <div
                                          key={donation.id}
                                          className="text-xs text-text-secondary"
                                        >
                                          ₹{donation.amount} on{" "}
                                          {new Date(
                                            donation.date,
                                          ).toLocaleDateString()}
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {donor.status !== "blocked" ? (
                                <button
                                  onClick={() =>
                                    handleBlockDonor(donor.donor_email)
                                  }
                                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-2"
                                >
                                  <Ban size={16} />
                                  Block
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleUnblockDonor(donor.donor_email)
                                  }
                                  className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center gap-2"
                                >
                                  <CheckCircle size={16} />
                                  Unblock
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-text-secondary py-8">
                    No donors yet
                  </p>
                )}
              </div>
            )}

            {/* Finance Tab */}
            {activeTab === "finance" && (
              <div className="space-y-6">
                {/* Finance Dashboard Cards */}
                {financeData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
                      <p className="text-sm opacity-90 mb-2">
                        Total Collections
                      </p>
                      <p className="text-3xl font-bold">
                        ₹{financeData.total_collections.toLocaleString()}
                      </p>
                      <p className="text-xs opacity-75 mt-2">
                        {financeData.total_donors} donors +{" "}
                        {financeData.total_members} members
                      </p>
                    </div>

                    <div className="card p-6 bg-gradient-to-br from-secondary to-secondary/80 text-white">
                      <p className="text-sm opacity-90 mb-2">
                        Today's Donations
                      </p>
                      <p className="text-3xl font-bold">
                        ₹{financeData.today_donations.toLocaleString()}
                      </p>
                      <p className="text-xs opacity-75 mt-2">
                        {financeData.today_donations_count} transactions
                      </p>
                    </div>

                    <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-400 text-white">
                      <p className="text-sm opacity-90 mb-2">
                        Monthly Collections
                      </p>
                      <p className="text-3xl font-bold">
                        ₹{financeData.monthly_donations.toLocaleString()}
                      </p>
                      <p className="text-xs opacity-75 mt-2">
                        {financeData.monthly_donations_count} this month
                      </p>
                    </div>

                    <div className="card p-6 bg-gradient-to-br from-purple-500 to-purple-400 text-white">
                      <p className="text-sm opacity-90 mb-2">
                        Member Collections
                      </p>
                      <p className="text-3xl font-bold">
                        ₹{financeData.member_collections.toLocaleString()}
                      </p>
                      <p className="text-xs opacity-75 mt-2">
                        Registration fees
                      </p>
                    </div>
                  </div>
                )}

                {/* Transaction List */}
                <div className="card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-2xl font-bold text-primary">
                      All Transactions
                    </h2>
                    <button
                      onClick={handleExportCSV}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Download size={18} />
                      Export CSV
                    </button>
                  </div>

                  {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-text-primary">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-text-primary">
                              Type
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-text-primary">
                              Name
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-text-primary">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-text-primary">
                              Amount
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-text-primary">
                              Payment ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-text-primary">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions
                            .slice(0, 50)
                            .map((transaction, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-100 hover:bg-gray-50"
                              >
                                <td className="py-3 px-4 text-sm">
                                  {new Date(
                                    transaction.date,
                                  ).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      transaction.type === "Donation"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {transaction.type}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  {transaction.name}
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  {transaction.email}
                                </td>
                                <td className="py-3 px-4 text-sm font-bold text-primary">
                                  ₹{transaction.amount}
                                </td>
                                <td className="py-3 px-4 text-xs font-mono text-text-muted">
                                  {transaction.payment_id || "N/A"}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {transaction.status || "completed"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-text-secondary py-8">
                      No transactions yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
