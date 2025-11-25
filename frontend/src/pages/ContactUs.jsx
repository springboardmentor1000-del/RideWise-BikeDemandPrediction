import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // You can integrate this with your backend endpoint later
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f534f]/95 text-white px-6 py-12">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center mb-4">Contact Us</h2>
        <p className="text-center text-white/80 mb-8">
          Have any questions, feedback, or issues? We’d love to hear from you.
        </p>

        {submitted ? (
          <div className="text-center text-green-400 font-semibold text-lg">
            ✅ Your message has been sent successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-b from-orange-500 to-orange-600 shadow-lg hover:shadow-xl hover:from-orange-400 hover:to-orange-500 transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
