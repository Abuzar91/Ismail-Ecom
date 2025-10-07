import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  User,
  Phone,
  Crown,
  Sparkles,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import Breadcrumb from "../components/Breadcrumb";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        let result = await login(formData.email, formData.password);

        if (!result.success) {
          const response = await axios.post("/api/auth/customer-login", {
            email: formData.email,
            password: formData.password,
          });

          if (response.data.success) {
            localStorage.setItem("customerToken", response.data.token);
            toast.success("Login successful!");
            navigate("/");
            return;
          }
        } else {
          toast.success("Login successful!");
          navigate(result.user?.role === "admin" ? "/admin/dashboard" : "/");
          return;
        }

        toast.error("Invalid email or password");
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }

        const response = await axios.post("/api/auth/customer-signup", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        if (response.data.success) {
          toast.success("Account created successfully! Please login.");
          setIsLogin(true);
          resetForm();
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        error.response?.data?.message ||
          `${isLogin ? "Login" : "Signup"} failed`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: isLogin ? "Login" : "Sign Up", path: "/auth" },
  ];

  return (
    <div className="min-h-screen bg-luxury-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 via-transparent to-luxury-gold/5"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <Breadcrumb customItems={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col justify-center"
          >
            <div className="space-y-8">
              <Link to="/" className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="font-serif text-5xl font-bold text-luxury-gold tracking-wider">
                    NOIR ESSENCE
                  </span>
                </div>
              </Link>

              <div>
                <h1 className="font-serif text-5xl font-bold text-luxury-pearl mb-6">
                  {isLogin ? "Welcome Back" : "Join Our Exclusive Circle"}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  {isLogin
                    ? "Sign in to access your collection and continue your luxury fragrance journey."
                    : "Create an account to unlock exclusive benefits and personalized fragrance experiences."}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-pearl mb-1">
                      Exclusive Access
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Priority access to new collections and limited editions
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-pearl mb-1">
                      Personalized Experience
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Curated recommendations based on your preferences
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-pearl mb-1">
                      Secure & Private
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Your information is protected with enterprise-grade
                      security
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <Logo size="xl" />
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mt-6 mb-6"></div>
              <h2 className="font-serif text-3xl font-bold text-luxury-pearl mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-300">
                {isLogin
                  ? "Sign in to your account"
                  : "Join us for exclusive offers"}
              </p>
            </div>

            <div className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-8 backdrop-blur-sm">
              {/* Desktop Header */}
              <div className="hidden lg:block mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-medium mb-4 backdrop-blur-sm">
                  <Crown className="w-4 h-4 mr-2" />
                  {isLogin ? "Member Access" : "New Member"}
                </div>
                <h2 className="font-serif text-3xl font-bold text-luxury-pearl">
                  {isLogin ? "Sign In" : "Create Account"}
                </h2>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name Field (Signup only) */}
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-luxury-pearl mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-luxury-gold/50" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required={!isLogin}
                        value={formData.name}
                        onChange={handleChange}
                        className="appearance-none relative block w-full pl-12 pr-4 py-3 bg-luxury-black border border-luxury-gold/30 placeholder-gray-500 text-luxury-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-luxury-pearl mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-luxury-gold/50" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none relative block w-full pl-12 pr-4 py-3 bg-luxury-black border border-luxury-gold/30 placeholder-gray-500 text-luxury-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Phone Field (Signup only) */}
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-luxury-pearl mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-luxury-gold/50" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="appearance-none relative block w-full pl-12 pr-4 py-3 bg-luxury-black border border-luxury-gold/30 placeholder-gray-500 text-luxury-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="03XX XXXXXXX"
                      />
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-luxury-pearl mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-luxury-gold/50" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none relative block w-full pl-12 pr-12 py-3 bg-luxury-black border border-luxury-gold/30 placeholder-gray-500 text-luxury-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-luxury-gold/50 hover:text-luxury-gold transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-luxury-gold/50 hover:text-luxury-gold transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Signup only) */}
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-luxury-pearl mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-luxury-gold/50" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required={!isLogin}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none relative block w-full pl-12 pr-12 py-3 bg-luxury-black border border-luxury-gold/30 placeholder-gray-500 text-luxury-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-luxury-gold/50 hover:text-luxury-gold transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-luxury-gold/50 hover:text-luxury-gold transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-4 px-4 bg-black border-2 border-luxury-gold text-luxury-gold font-semibold rounded-none hover:bg-luxury-gold hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-luxury-gold/50"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                      {isLogin ? (
                        <LogIn className="h-5 w-5 group-hover:text-black transition-colors" />
                      ) : (
                        <UserPlus className="h-5 w-5 group-hover:text-black transition-colors" />
                      )}
                    </span>
                    {loading
                      ? isLogin
                        ? "Signing in..."
                        : "Creating Account..."
                      : isLogin
                      ? "Sign In"
                      : "Create Account"}
                  </button>
                </div>
              </form>

              {/* Toggle Mode */}
              <div className="mt-8 text-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent mb-6"></div>
                <p className="text-sm text-gray-300">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    onClick={toggleMode}
                    className="font-medium text-luxury-gold hover:text-yellow-400 transition-colors duration-200"
                  >
                    {isLogin ? "Sign up here" : "Sign in here"}
                  </button>
                </p>
              </div>

              {/* Trust Badge */}
              <div className="mt-6 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm p-4 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4 text-luxury-gold" />
                  <p className="text-xs text-gray-300">
                    Your information is protected with 256-bit encryption
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
