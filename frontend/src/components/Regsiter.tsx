import React, { useState } from "react";
import axios from "axios";

interface SignupData {
  firstname: string;
  lastname: string;
  gender: string;
  date_of_birth: string;
  email: string;
  password?: string;
  country_code: string;
  phone: string;
  current_location: string;
  home_town: string;
  country: string;
  career_preference_internships: boolean;
  career_preference_jobs: boolean;
  preferred_work_location: string;
  
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
  
};

export default function StudentSignupForm() {
  const [formData, setFormData] = useState<SignupData>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      setError("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        phone: formData.phone,
      };

      const response = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/signup`,
  payload
);
      setSuccess(response.data.message);
      setFormData(initialState);
    } catch (err: any) {
      const detail = err.response?.data?.detail ?? "Registration failed";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 md:p-12 border border-blue-200">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
          Student Registration
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          {Object.entries(formData).map(([key, value]) => null)}

          <div className="flex flex-col">
            <label htmlFor="firstname" className="font-medium mb-1 text-blue-800">
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastname" className="font-medium mb-1 text-blue-800">
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="gender" className="font-medium mb-1 text-blue-800">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="TRANSGENDER">Transgender</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="date_of_birth" className="font-medium mb-1 text-blue-800">
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium mb-1 text-blue-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-medium mb-1 text-blue-800">
              Password 
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1 text-blue-800">Phone</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                className="w-20 bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit number"
                required
                className="flex-grow bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="current_location" className="font-medium mb-1 text-blue-800">
              Current Location
            </label>
            <input
              id="current_location"
              name="current_location"
              value={formData.current_location}
              onChange={handleChange}
              required
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="home_town" className="font-medium mb-1 text-blue-800">
              Home Town
            </label>
            <input
              id="home_town"
              name="home_town"
              value={formData.home_town}
              onChange={handleChange}
              required
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="country" className="font-medium mb-1 text-blue-800">
              Country
            </label>
            <input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="preferred_work_location" className="font-medium mb-1 text-blue-800">
              Preferred Work Location
            </label>
            <input
              id="preferred_work_location"
              name="preferred_work_location"
              value={formData.preferred_work_location}
              onChange={handleChange}
              required
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="font-medium mb-2 text-blue-800">Career Preferences</label>
            <div className="flex space-x-6">
              <label className="inline-flex items-center space-x-2 text-blue-900">
                <input
                  type="checkbox"
                  name="career_preference_internships"
                  checked={formData.career_preference_internships}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span>Internships</span>
              </label>
              <label className="inline-flex items-center space-x-2 text-blue-900">
                <input
                  type="checkbox"
                  name="career_preference_jobs"
                  checked={formData.career_preference_jobs}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span>Jobs</span>
              </label>
            </div>
          </div>

          {/* <div className="flex flex-col md:col-span-2">
            <label htmlFor="resume_url" className="font-medium mb-1 text-blue-800">
              Resume URL
            </label>
            <input
              id="resume_url"
              name="resume_url"
              type="url"
              value={formData.resume_url}
              onChange={handleChange}
              placeholder="https://example.com/resume.pdf"
              className="bg-blue-50 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </div>

          {error && (
            <p className="md:col-span-2 text-red-600 text-center font-medium">
              {error}
            </p>
          )}
          {success && (
            <p className="md:col-span-2 text-green-600 text-center font-medium">
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}