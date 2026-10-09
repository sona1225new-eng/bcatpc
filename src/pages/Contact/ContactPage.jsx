import React, { useState } from 'react';
import { 
  HiOutlineLocationMarker, 
  HiOutlinePhone, 
  HiOutlineMail, 
  HiOutlineClock, 
  HiOutlineCheckCircle,
  HiOutlinePaperAirplane,
  HiOutlineAcademicCap,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import SectionHeading from '../../components/common/SectionHeading';
import { contactData } from '../../data/contact';
import { siteConfig } from '../../config/siteConfig';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'BCA Admission Inquiry',
    semester: '1st Semester (Freshman)',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbs = [
    { label: "Contact", href: "/contact" },
    { label: "Department Helpdesk & Admissions" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API form submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'BCA Admission Inquiry',
        semester: '1st Semester (Freshman)',
        message: '',
      });
    }, 600);
  };

  return (
    <div>
      <PageHeader
        badge="GET IN TOUCH"
        title="Contact Department of"
        highlight="Computer Application"
        description="Have queries regarding BCA admissions for 2026-2029 session, university examinations, lab access, or student verifications? Reach out to our department office."
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Contact Info Cards + Interactive Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Official Contact Cards & Working Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                OFFICIAL HELPLINE
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                Department Office & Helpdesk
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {siteConfig.collegeName} ({siteConfig.affiliation})
              </p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0">
                  <HiOutlineLocationMarker className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Campus Location</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {contactData.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <HiOutlinePhone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Phone Helplines</h4>
                  <p className="text-xs text-slate-500">Mon-Sat during office hours</p>
                </div>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                {contactData.phoneNumbers.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">{p.label}:</span>
                    <a href={`tel:${p.raw}`} className="font-bold text-navy-900 hover:text-amber-600">
                      {p.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Emails */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center flex-shrink-0">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Email Inquiries</h4>
                  <p className="text-xs text-slate-500">Official correspondence</p>
                </div>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                {contactData.emails.map((m, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">{m.label}</span>
                    <a href={`mailto:${m.email}`} className="font-bold text-navy-900 hover:text-amber-600 truncate">
                      {m.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <HiOutlineClock className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Office Hours & Timings</h4>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                {contactData.workingHours.map((wh, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{wh.days}:</span>
                    <span className="font-bold text-amber-400">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Admission & General Inquiry Form */}
          <div id="admission-inquiry" className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                DIRECT INQUIRY DESK
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                Send an Online Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in the details below. Our academic counseling cell will respond within 24-48 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <HiOutlineCheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Inquiry Received Successfully!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for contacting the Department of Computer Application, T.P. College Madhepura. Our admission and helpdesk team will get in touch shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Alok Kumar"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-xs sm:text-sm outline-none bg-slate-50 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., alok@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-xs sm:text-sm outline-none bg-slate-50 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g., +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-xs sm:text-sm outline-none bg-slate-50 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-xs sm:text-sm outline-none bg-slate-50 font-medium cursor-pointer"
                    >
                      <option>BCA Admission Inquiry (Session 2026-29)</option>
                      <option>University Examination & Form Routine</option>
                      <option>PYQs & Study Material Query</option>
                      <option>Lab Access & Coding Club</option>
                      <option>General Academic Inquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Your Message / Question *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your questions regarding admission eligibility, documents, or fee structure..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-xs sm:text-sm outline-none bg-slate-50 font-medium resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#233B5D] hover:bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <HiOutlinePaperAirplane className="w-4 h-4 text-amber-400 rotate-90" />
                      <span>SUBMIT INQUIRY TO DEPARTMENT</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Interactive Google Map embed / Location Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineLocationMarker className="w-5 h-5 text-rose-600" />
              <span>Campus Map & Directions (T.P. College Madhepura)</span>
            </h4>
            <span className="text-xs text-slate-500">Stadium Road, Madhepura, Bihar 852113</span>
          </div>

          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <iframe
              title="T.P. College Madhepura Campus Map"
              src={contactData.locationCoords.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
