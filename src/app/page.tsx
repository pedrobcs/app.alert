'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ArrowRight, Camera, CheckCircle2, Info, ShieldCheck, UploadCloud } from 'lucide-react';

type IntentFormState = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  countryOfCitizenship: string;
  email: string;
  phone: string;
};

const MAX_SELFIE_BYTES = 5 * 1024 * 1024; // 5MB

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<IntentFormState>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    countryOfCitizenship: '',
    email: '',
    phone: '',
  });
  const [selfie, setSelfie] = useState<File | null>(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selfie) {
      setSelfiePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selfie);
    setSelfiePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selfie]);

  const isValid = useMemo(() => {
    return (
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.dateOfBirth.trim().length > 0 &&
      form.countryOfCitizenship.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.phone.trim().length > 0 &&
      !!selfie
    );
  }, [form, selfie]);

  const onChange = (key: keyof IntentFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setSelfie(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Selfie must be an image file (JPG/PNG/WebP).');
      setSelfie(null);
      return;
    }
    if (file.size > MAX_SELFIE_BYTES) {
      setError('Selfie is too large. Please upload an image under 5MB.');
      setSelfie(null);
      return;
    }
    setError(null);
    setSelfie(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setConfirmationId(null);

    if (!isValid || !selfie) {
      setError('Please fill in all required fields and upload a clear selfie.');
      return;
    }

    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.set('firstName', form.firstName.trim());
      body.set('middleName', form.middleName.trim());
      body.set('lastName', form.lastName.trim());
      body.set('dateOfBirth', form.dateOfBirth);
      body.set('countryOfCitizenship', form.countryOfCitizenship.trim());
      body.set('email', form.email.trim());
      body.set('phone', form.phone.trim());
      body.set('selfie', selfie);

      const res = await fetch('/api/departure-intent', { method: 'POST', body });
      const json = (await res.json()) as { ok?: boolean; confirmationId?: string; error?: string };
      if (!res.ok || !json.ok || !json.confirmationId) {
        throw new Error(json.error || 'Submission failed. Please try again.');
      }

      setConfirmationId(json.confirmationId);
      setForm({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        countryOfCitizenship: '',
        email: '',
        phone: '',
      });
      setSelfie(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-sm font-bold mb-6 shadow-lg">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Intent to Depart helper • Potential reward up to $1,000
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              CBP Home “Intent to Depart”
              <span className="text-gradient block mt-1">All required info, in one place.</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Enter the details requested by the CBP Home Mobile app when submitting an Intent to Depart, then upload a clear selfie.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: info panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="card-premium p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">What you’ll need</h2>
                    <p className="text-gray-600 mt-1">
                      When submitting an Intent to Depart via the CBP Home Mobile app, you’ll be asked for:
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-gray-800">
                  {[
                    'First name',
                    'Middle name',
                    'Last name',
                    'Date of birth',
                    'Country of citizenship',
                    'Email address',
                    'Phone number',
                    'A clear self-photo, or selfie',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-amber-900" />
                  </div>
                  <div>
                    <div className="font-bold text-amber-950">Not an official government site</div>
                    <div className="text-sm text-amber-900 mt-1">
                      This page is an independent helper. It is not affiliated with CBP. Reward eligibility (including “up to $1,000”) depends on external rules and is not guaranteed here.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div id="form" className="lg:col-span-7 card-premium p-6 sm:p-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Enter your information</h2>
                  <p className="text-gray-600 mt-1">Fields marked with * are required.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <Camera className="w-4 h-4" />
                  <span>Selfie required</span>
                </div>
              </div>

              {confirmationId && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Submitted successfully
                  </div>
                  <div className="text-sm mt-1">
                    Confirmation ID: <span className="font-mono font-semibold">{confirmationId}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
                  <div className="font-semibold">Fix this to continue</div>
                  <div className="text-sm mt-1">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">First name *</label>
                    <input
                      value={form.firstName}
                      onChange={onChange('firstName')}
                      autoComplete="given-name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Middle name</label>
                    <input
                      value={form.middleName}
                      onChange={onChange('middleName')}
                      autoComplete="additional-name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Middle name (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Last name *</label>
                    <input
                      value={form.lastName}
                      onChange={onChange('lastName')}
                      autoComplete="family-name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Date of birth *</label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={onChange('dateOfBirth')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Country of citizenship *</label>
                    <input
                      value={form.countryOfCitizenship}
                      onChange={onChange('countryOfCitizenship')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Country of citizenship"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Email address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={onChange('email')}
                      autoComplete="email"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Phone number *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={onChange('phone')}
                      autoComplete="tel"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">A clear self-photo / selfie *</label>
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-5">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                          <UploadCloud className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Upload a clear selfie</div>
                          <div className="text-sm text-gray-600">JPG/PNG/WebP, max 5MB</div>
                        </div>
                      </div>

                      <div className="md:ml-auto flex items-center gap-3">
                        <label className="btn btn-outline cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSelfieChange}
                            className="hidden"
                            required={!selfie}
                          />
                          Choose file
                        </label>
                        {selfie && (
                          <button
                            type="button"
                            onClick={() => setSelfie(null)}
                            className="btn btn-secondary"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {selfiePreviewUrl && (
                      <div className="mt-5">
                        <div className="text-sm font-semibold text-gray-800 mb-2">Preview</div>
                        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selfiePreviewUrl}
                            alt="Selfie preview"
                            className="w-full max-h-[360px] object-contain bg-gray-50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit intent'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="text-sm text-gray-600">
                    By submitting, you confirm the information is accurate and the selfie is clearly identifiable.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
