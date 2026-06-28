import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, CheckCircle } from "lucide-react";

const INITIAL_STATE = { name: "", email: "", subject: "", message: "" };

export default function ContactSection() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())    newErrors.name    = "Name is required";
    if (!form.email.trim())   newErrors.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Hapus error saat user mulai mengetik
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setIsSubmitting(true);
    // Simulasi kirim (ganti dengan API/EmailJS/Formspree Anda)
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setForm(INITIAL_STATE);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "10px 14px",
    fontFamily: "monospace",
    fontSize: 13,
    color: "#1a1817",
    backgroundColor: errors[field] ? "#fdf0f0" : "#faf5e8",
    border: `1px solid ${errors[field] ? "#c0392b" : "#c4a96a"}`,
    borderRadius: 2,
    outline: "none",
    resize: field === "message" ? "vertical" : undefined,
  });

  const labelStyle = {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 3,
    color: "#7a3b2e",
    textTransform: "uppercase",
    fontWeight: 700,
    marginBottom: 6,
    display: "block",
  };

  return (
    <section id="contact" className="py-20 px-4" style={{ backgroundColor: "#ede4c8" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 8, color: "#7a3b2e", textTransform: "uppercase", marginBottom: 8 }}>
            ◈ Inquiries
          </p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#1a1817" }}>
            Booking & Hires
          </h2>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem", color: "#6a5a4a", fontStyle: "italic", marginTop: 8 }}>
            "All business inquiries, collaborations, and project proposals"
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-sm overflow-hidden"
          style={{
            border: "2px solid #c4a96a",
            boxShadow: "8px 8px 0 #1a1817",
          }}
        >
          {/* Form header */}
          <div
            className="py-3 px-6 flex justify-between items-center"
            style={{ backgroundColor: "#1a1817" }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, color: "#dcae1d", fontWeight: 700 }}>
              BOOKING REQUEST FORM
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "#6a5a4a" }}>
              REF: VNL-{new Date().getFullYear()}
            </span>
          </div>

          {/* Form body */}
          <div className="p-8" style={{ backgroundColor: "#f8f0d8" }}>
            {submitted ? (
              // ── Success state ──
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle size={48} style={{ color: "#5a7a3e", margin: "0 auto 16px" }} />
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", fontWeight: 900, color: "#1a1817", marginBottom: 8 }}>
                  Message Received!
                </h3>
                <p style={{ fontFamily: "monospace", fontSize: 12, color: "#6a5a4a", letterSpacing: 1, lineHeight: 1.8 }}>
                  Your booking request has been logged.<br />
                  Expect a response within 1–2 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-6 py-2.5 transition-colors"
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    letterSpacing: 3,
                    color: "#f4ebd0",
                    backgroundColor: "#1a1817",
                    border: "none",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              // ── Form ──
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>
                      <User size={10} className="inline mr-1" />
                      Artist / Client Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      style={inputStyle("name")}
                    />
                    {errors.name && <p style={{ fontFamily: "monospace", fontSize: 10, color: "#c0392b", marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>
                      <Mail size={10} className="inline mr-1" />
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      style={inputStyle("email")}
                    />
                    {errors.email && <p style={{ fontFamily: "monospace", fontSize: 10, color: "#c0392b", marginTop: 4 }}>{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={labelStyle}>
                    Subject / Project Type
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    style={{ ...inputStyle("subject"), cursor: "pointer" }}
                  >
                    <option value="">— Select inquiry type —</option>
                    <option value="Freelance Project">Freelance Project</option>
                    <option value="Full-time Opportunity">Full-time Opportunity</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && <p style={{ fontFamily: "monospace", fontSize: 10, color: "#c0392b", marginTop: 4 }}>{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>
                    <MessageSquare size={10} className="inline mr-1" />
                    Message / Brief
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your project, timeline, and budget..."
                    style={inputStyle("message")}
                  />
                  {errors.message && <p style={{ fontFamily: "monospace", fontSize: 10, color: "#c0392b", marginTop: 4 }}>{errors.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 flex items-center justify-center gap-3 transition-all disabled:opacity-60"
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    letterSpacing: 4,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#dcae1d",
                    backgroundColor: "#1a1817",
                    border: "2px solid #1a1817",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "4px 4px 0 #dcae1d",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ width: 16, height: 16, border: "2px solid #dcae1d44", borderTop: "2px solid #dcae1d", borderRadius: "50%" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Submit Booking Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Form footer */}
          <div
            className="px-6 py-3 flex justify-between"
            style={{ backgroundColor: "#e8d9b0", borderTop: "1px dashed #c4a96a" }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "#8a7a6a", letterSpacing: 2 }}>
              RESPONSE TIME: 24–48 HRS
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "#8a7a6a", letterSpacing: 2 }}>
              arya@example.com
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
