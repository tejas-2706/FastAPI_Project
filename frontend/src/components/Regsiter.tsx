import React, { useState } from "react";
import axios from "axios";

// Make sure these styles are in your global CSS file (e.g., src/index.css)
// and NOT in this component's <style> tag.
/*
html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #333;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4a90e2;
  border-radius: 10px;
  border: 2px solid #333;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6aabf7;
}

.date-input-placeholder::-webkit-datetime-edit-year-field,
.date-input-placeholder::-webkit-datetime-edit-month-field,
.date-input-placeholder::-webkit-datetime-edit-day-field,
.date-input-placeholder::-webkit-datetime-edit-text {
    color: #9ca3af;
}
.date-input-placeholder:focus::-webkit-datetime-edit-year-field,
.date-input-placeholder:focus::-webkit-datetime-edit-month-field,
.date-input-placeholder:focus::-webkit-datetime-edit-day-field,
.date-input-placeholder:focus::-webkit-datetime-edit-text {
    color: white;
}
.date-input-placeholder:valid {
    color: white;
}
.date-input-placeholder:not([value=""])::-webkit-datetime-edit-year-field,
.date-input-placeholder:not([value=""])::-webkit-datetime-edit-month-field,
.date-input-placeholder:not([value=""])::-webkit-datetime-edit-day-field,
.date-input-placeholder:not([value=""])::-webkit-datetime-edit-text {
  color: white;
}
*/

interface SignupData {
  firstname: string;
  lastname: string;
  gender: string;
  date_of_birth: string;
  email: string;
  password?: string; // Password is now optional in interface if it's not always required by backend
  country_code: string;
  phone: string;
  current_location: string;
  home_town: string;
  country: string;
  career_preference_internships: boolean;
  career_preference_jobs: boolean;
  preferred_work_location: string;
  zip_postal_code?: string;
  street_address?: string;
  terms_agreement: boolean;
}

const initialState: SignupData = {
  firstname: "",
  lastname: "",
  gender: "",
  date_of_birth: "",
  email: "",
  password: "",
  country_code: "+91",
  phone: "",
  current_location: "",
  home_town: "",
  country: "India",
  career_preference_internships: false,
  career_preference_jobs: false,
  preferred_work_location: "",
  zip_postal_code: "",
  street_address: "",
  terms_agreement: false,
};

export default function StudentSignupForm() {
  const [formData, setFormData] = useState<SignupData>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  // Removed showConfirmPassword state as it's no longer needed

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    // Removed password matching validation
    if (!formData.terms_agreement) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        phone: formData.phone,
        // confirm_password is no longer in formData, so no need to explicitly exclude
      };

          const response = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/signup`,
  payload
);
      setSuccess(response.data.message);
      setFormData(initialState); // Clear form on success
    } catch (err: any) {
      const detail = err.response?.data?.detail ?? "Registration failed";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container: Still full screen for background, but its overflow is hidden to contain blobs
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-800 font-sans relative overflow-hidden">
      {/* Abstract shapes for background attractiveness */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Form container: This is the scrollable element if content overflows */}
      <div className="w-full max-w-4xl bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-12 border border-blue-500 relative z-10 animate-fade-in mx-4 my-8 max-h-[95vh] overflow-y-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex justify-center mb-10"> {/* Increased bottom margin */}
          {/* EduDiagno Logo/Text */}
          <span className="text-white text-4xl font-extrabold flex items-center">
            <span className="bg-blue-600 px-4 py-2 rounded-xl mr-3 text-white">E</span> {/* Larger padding, more rounded */}
            EduDiagno
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white text-center tracking-tight">
          Create Student Account
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg"> {/* Increased bottom margin */}
          Start hiring smarter with AI-powered interviews
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-gray-200"> {/* Increased gap */}
          {/* Basic Information Section */}
          <div className="md:col-span-2 text-xl font-semibold text-white mb-2 border-b border-gray-700 pb-2"> {/* Adjusted margin-bottom */}
            Basic Information
          </div>

          <div className="flex flex-col">
            <label htmlFor="firstname" className="font-medium mb-1 text-gray-300">
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              placeholder="John"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastname" className="font-medium mb-1 text-gray-300">
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              placeholder="Doe"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium mb-1 text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              placeholder="john.doe@example.com"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1 text-gray-300">Phone Number</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                className="w-24 bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
                placeholder="+91"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-medium mb-1 text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10 placeholder-gray-500 hover:border-blue-500"
                placeholder="****"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.5 10.5 0 01-4.279 5.821M12 17.25a4.5 4.5 0 100-9 4.5 4.5 0 000 9z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                  )}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* REMOVED: Confirm Password Section */}

          <div className="flex flex-col">
            <label htmlFor="gender" className="font-medium mb-1 text-gray-300">
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none pr-10 hover:border-blue-500"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="TRANSGENDER">Transgender</option>
                <option value="OTHER">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="date_of_birth" className="font-medium mb-1 text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 date-input-placeholder hover:border-blue-500"
            />
          </div>

          {/* Address Information Section */}
          <div className="md:col-span-2 text-xl font-semibold text-white mb-2 mt-6 border-b border-gray-700 pb-2">
            Address Information
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label htmlFor="street_address" className="font-medium mb-1 text-gray-300">
              Street Address
            </label>
            <input
              type="text"
              id="street_address"
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              placeholder="123 Main St"
            />
          </div>
           

          <div className="flex flex-col">
            <label htmlFor="country" className="font-medium mb-1 text-gray-300">
              Country
            </label>
            <input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              placeholder="India"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="current_location" className="font-medium mb-1 text-gray-300">
              State/Province
            </label>
            <input
              id="current_location"
              name="current_location"
              value={formData.current_location}
              onChange={handleChange}
              required
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              placeholder="Maharashtra"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="home_town" className="font-medium mb-1 text-gray-300">
              City
            </label>
            <input
              id="home_town"
              name="home_town"
              value={formData.home_town}
              onChange={handleChange}
              required
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              placeholder="Pune"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="zip_postal_code" className="font-medium mb-1 text-gray-300">
              ZIP/Postal Code
            </label>
            <input
              type="text"
              id="zip_postal_code"
              name="zip_postal_code"
              value={formData.zip_postal_code}
              onChange={handleChange}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              placeholder="411001"
            />
          </div>

        

          {/* Career Preferences Section */}
          <div className="md:col-span-2 text-xl font-semibold text-white mb-2 mt-6 border-b border-gray-700 pb-2">
            Career Preferences
          </div>

           <div className="flex items-center space-x-8 md:col-span-2 mt-4">
            <label className="inline-flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                name="career_preference_internships"
                checked={formData.career_preference_internships}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700 checked:bg-blue-600 checked:border-transparent focus:ring-offset-gray-800"
              />
              <span>Internships</span>
            </label>
            <label className="inline-flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                name="career_preference_jobs"
                checked={formData.career_preference_jobs}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700 checked:bg-blue-600 checked:border-transparent focus:ring-offset-gray-800"
              />
              <span>Jobs</span>
            </label>
          </div>

          <div className="flex flex-col md:col-span-2">
            <label htmlFor="preferred_work_location" className="font-medium mb-1 text-gray-300">
              Preferred Work Location
            </label>
            <input
              id="preferred_work_location"
              name="preferred_work_location"
              value={formData.preferred_work_location}
              onChange={handleChange}
              required
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:border-blue-500"
              placeholder="Remote, Bangalore, Mumbai"
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="md:col-span-2 flex items-start mt-8">
            <input
              type="checkbox"
              id="terms_agreement"
              name="terms_agreement"
              checked={formData.terms_agreement}
              onChange={handleChange}
              required
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700 checked:bg-blue-600 checked:border-transparent focus:ring-offset-gray-800 mt-1"
            />
            <label htmlFor="terms_agreement" className="ml-3 text-gray-400 text-base leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-blue-400 hover:underline font-semibold">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-400 hover:underline font-semibold">
                Privacy Policy
              </a>
              , and consent to having my data processed for the purpose of creating an account.
            </label>
          </div>

          {/* Submission Button */}
          <div className="md:col-span-2 flex justify-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-black font-semibold py-3 px-10 rounded-lg shadow-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transform hover:-translate-y-1 hover:scale-105"
            >
              <span>{loading ? "Creating account..." : "Create Account"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <p className="md:col-span-2 text-red-400 text-center font-medium mt-6 bg-red-900 bg-opacity-30 p-3 rounded-lg border border-red-700 animate-fade-in">
              {error}
            </p>
          )}
          {success && (
            <p className="md:col-span-2 text-green-400 text-center font-medium mt-6 bg-green-900 bg-opacity-30 p-3 rounded-lg border border-green-700 animate-fade-in">
              {success}
            </p>
          )}

          {/* Login Link */}
          
        </form>
      </div>
    </div>
  );
}