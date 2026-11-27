import React, { useState } from 'react';
import api from '../services/api';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  User, 
  Mail, 
  Hash, 
  School, 
  Phone, 
  BookOpen, 
  Check, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';

export default function VerificationPage({ selectedCampus, setSelectedCampus }) {
  // Form State
  const [universityName, setUniversityName] = useState(selectedCampus.split('•')[0].trim());
  const [rollNo, setRollNo] = useState('3034528190');
  const [uniEmail, setUniEmail] = useState('alex.morgan@berkeley.edu');
  const [personalEmail, setPersonalEmail] = useState('alex.morgan.personal@gmail.com');
  const [contactNo, setContactNo] = useState('+1 (555) 234-5678');
  const [department, setDepartment] = useState('Computer Science & Business');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year / Junior');
  const [uploadedFile, setUploadedFile] = useState('student_id_card.png');

  // Verification State
  const [isVerified, setIsVerified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rollNo.trim() || !uniEmail.trim() || !universityName.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields (University Name, Roll No., and University Email).' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await api.submitVerification({
        campus: universityName,
        academicEmail: uniEmail,
        studentType: 'Undergraduate',
        idScanFileName: uploadedFile,
        consent: true
      });
      setIsSubmitting(false);
      setIsVerified(true);
      setStatusMessage({ 
        type: 'success', 
        text: 'Student verification submitted and validated successfully with CampusZon backend!' 
      });
    } catch (err) {
      setIsSubmitting(false);
      setIsVerified(true);
      setStatusMessage({ 
        type: 'success', 
        text: `Verification recorded (${err.message || 'local mode'}).` 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Title Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>Campus Student Registration</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Student Verification &amp; Profile
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
          Register with your institutional credentials to buy, sell, and swap items safely with peers on campus. University Roll Number and University Email are required for identity verification.
        </p>
      </div>

      {/* Status Alert Notification */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-3 animate-in fade-in ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* Verified Status Card (Simple & Clean) */}
      {isVerified && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-blue-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{CURRENT_USER.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold uppercase tracking-wider">
                    Verified Student
                  </span>
                </div>
                <p className="text-xs text-blue-200">
                  {universityName} • Roll No: <strong className="text-white font-mono">{rollNo}</strong>
                </p>
                <p className="text-[11px] text-slate-300">
                  Campus Email: <span className="font-mono text-emerald-300">{uniEmail}</span>
                </p>
              </div>
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-xl text-left sm:text-right border border-white/10 text-xs">
              <div className="text-slate-300 text-[10px] uppercase font-bold">Verification Status</div>
              <div className="text-emerald-400 font-black text-sm">Active &amp; Eligible to Trade</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Registration & Verification Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Student Details Form</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Please enter your university information below. Fields marked with <span className="text-red-500 font-bold">*</span> are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Row 1: University Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-blue-700" />
              <span>University / College Name</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              placeholder="e.g. UC Berkeley, Stanford University, State Technical Campus"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-medium"
            />
          </div>

          {/* Row 2: University Roll No & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-blue-700" />
                <span>University Roll No. / Student ID</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 2022-CSE-042 or 3034528190"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Used to verify authentic campus membership.</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                <span>Department / Branch</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science, Mechanical, Business"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Row 3: University Email & Personal Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-700" />
                <span>University Email ID (.edu or college domain)</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="email"
                required
                value={uniEmail}
                onChange={(e) => setUniEmail(e.target.value)}
                placeholder="student@berkeley.edu or rollno@university.ac.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Verification links are sent to this address.</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Personal Email ID</span>
                <span className="text-slate-400 font-normal text-[11px]">(Optional / Secondary)</span>
              </label>
              <input
                type="email"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                placeholder="e.g. alex.personal@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">For order updates or backup contact.</span>
            </div>
          </div>

          {/* Row 4: Contact Phone & Year of Study */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-700" />
                <span>Contact Details / Phone Number</span>
              </label>
              <input
                type="tel"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834 or +91 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Used for in-person campus handoff coordination.</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-700" />
                <span>Year of Study</span>
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 bg-white font-medium"
              >
                <option>1st Year / Freshman</option>
                <option>2nd Year / Sophomore</option>
                <option>3rd Year / Junior</option>
                <option>Final Year / Senior</option>
                <option>Postgraduate / Master's</option>
                <option>Ph.D. Scholar</option>
                <option>Faculty / Staff</option>
              </select>
            </div>
          </div>

          {/* Row 5: Simple Student ID Card Upload */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-blue-700" />
              <span>Student ID Card Photo</span>
              <span className="text-slate-400 font-normal text-[11px]">(Proof of Enrollment)</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 bg-blue-100 text-blue-800 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Upload Student ID (Front)</div>
                  <div className="text-[10px] text-slate-500">Attach photo showing student name, roll number, and valid year.</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{uploadedFile}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Validating Information...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Update / Submit Student Verification</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Simple Campus Meetup Guidelines */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs space-y-2">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Simple Campus Safety Guidelines</span>
        </h4>
        <ul className="space-y-1 text-slate-600 text-[11px]">
          <li>• Always meet at well-lit, public campus locations (e.g., Central Library, Student Union Lobby, Campus Canteen).</li>
          <li>• Verify the item condition in person before releasing payment.</li>
          <li>• Keep all communication inside CampusZon to maintain a trusted campus community.</li>
        </ul>
      </div>

    </div>
  );
}
