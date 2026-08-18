import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Link } from 'wouter';
import { CheckCircle2, AlertCircle, Upload, ArrowLeft, GraduationCap, Briefcase, Award } from 'lucide-react';

interface PortalSettings {
  siwes_open: boolean;
  internship_open: boolean;
  nysc_open: boolean;
}

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    institution: '',
    course_of_study: '',
    application_type: 'siwes', // default
    duration_months: '6 months',
    start_date: '',
    cover_letter: '',
  });

  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const { data: settings, isLoading: loadingSettings } = useQuery<PortalSettings>({
    queryKey: ['public-application-settings'],
    queryFn: () => api.get('/public/applications/settings').then(r => r.data),
  });

  const submitMut = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post('/public/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(r => r.data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to submit application. Please check your details.';
      toast.error(msg);
    },
  });

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (passportFile) data.append('passport_photo', passportFile);
    if (documentFile) data.append('document_path', documentFile);

    submitMut.mutate(data);
  };

  const isSiwesOpen = settings?.siwes_open ?? true;
  const isInternshipOpen = settings?.internship_open ?? true;
  const isNyscOpen = settings?.nysc_open ?? true;
  const isAllClosed = !isSiwesOpen && !isInternshipOpen && !isNyscOpen;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src="/FarmLogo.png" alt="EEFarm360 Logo" className="w-9 h-9 object-contain" />
          <span className="font-extrabold text-xl tracking-tight text-white">EEFarm360</span>
        </Link>
        <Button variant="outline" size="sm" className="border-emerald-700 text-emerald-100 hover:bg-emerald-900" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </Button>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 py-10">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Career & Industrial Training Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Apply for SIWES, Internship or NYSC
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Gain hands-on practical experience across modern agricultural management, livestock production, aquaculture, and water production at EEFarm360.
          </p>
        </div>

        {submitted ? (
          <Card className="max-w-xl mx-auto border-emerald-200 bg-white shadow-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Application Received!</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Thank you, <strong className="text-slate-900">{form.full_name}</strong>. Your application for <strong className="uppercase text-emerald-700">{form.application_type}</strong> has been submitted to EEFarm360 Management.
            </p>
            <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-500 text-left space-y-1">
              <p>• <strong>Email:</strong> {form.email}</p>
              <p>• <strong>Phone:</strong> {form.phone}</p>
              <p>• <strong>Institution:</strong> {form.institution || 'N/A'}</p>
            </div>
            <div className="pt-4 flex gap-3 justify-center">
              <Button onClick={() => setSubmitted(false)} variant="outline">Submit Another Application</Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </Card>
        ) : isAllClosed ? (
          <Card className="max-w-xl mx-auto p-8 text-center space-y-4 border-amber-200 bg-amber-50/50">
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
            <h2 className="text-2xl font-bold text-amber-900">Intake Currently Closed</h2>
            <p className="text-amber-800 text-sm">
              Application portals for SIWES, Internship, and NYSC are currently paused by administration. Please check back later or contact customer care.
            </p>
            <Button asChild className="bg-emerald-700 text-white">
              <Link href="/">Back to Home</Link>
            </Button>
          </Card>
        ) : (
          <Card className="shadow-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Select Type */}
                <div className="space-y-3">
                  <Label className="text-base font-bold">1. Select Application Type *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* SIWES Option */}
                    <button
                      type="button"
                      disabled={!isSiwesOpen}
                      onClick={() => set('application_type', 'siwes')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        form.application_type === 'siwes' && isSiwesOpen
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600'
                          : !isSiwesOpen
                          ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <GraduationCap className={`w-5 h-5 ${form.application_type === 'siwes' ? 'text-emerald-700' : 'text-slate-500'}`} />
                          {!isSiwesOpen && <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">Closed</span>}
                        </div>
                        <span className="font-bold text-slate-900 block">SIWES</span>
                        <span className="text-xs text-slate-500 block mt-0.5">Industrial Attachment for Students</span>
                      </div>
                    </button>

                    {/* Internship Option */}
                    <button
                      type="button"
                      disabled={!isInternshipOpen}
                      onClick={() => set('application_type', 'internship')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        form.application_type === 'internship' && isInternshipOpen
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600'
                          : !isInternshipOpen
                          ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Briefcase className={`w-5 h-5 ${form.application_type === 'internship' ? 'text-emerald-700' : 'text-slate-500'}`} />
                          {!isInternshipOpen && <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">Closed</span>}
                        </div>
                        <span className="font-bold text-slate-900 block">Internship</span>
                        <span className="text-xs text-slate-500 block mt-0.5">Professional Farm Training</span>
                      </div>
                    </button>

                    {/* NYSC Option */}
                    <button
                      type="button"
                      disabled={!isNyscOpen}
                      onClick={() => set('application_type', 'nysc')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        form.application_type === 'nysc' && isNyscOpen
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600'
                          : !isNyscOpen
                          ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Award className={`w-5 h-5 ${form.application_type === 'nysc' ? 'text-emerald-700' : 'text-slate-500'}`} />
                          {!isNyscOpen && <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">Closed</span>}
                        </div>
                        <span className="font-bold text-slate-900 block">NYSC Corp Member</span>
                        <span className="text-xs text-slate-500 block mt-0.5">Primary Assignment Posting</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Personal & Academic Details */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-base font-bold text-slate-900">2. Personal & Academic Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Full Name *</Label>
                      <Input
                        required
                        placeholder="e.g. Ibrahim Abubakar"
                        value={form.full_name}
                        onChange={e => set('full_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email Address *</Label>
                      <Input
                        type="email"
                        required
                        placeholder="ibrahim@example.com"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Phone Number (WhatsApp) *</Label>
                      <Input
                        required
                        placeholder="07012345678"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Institution / University</Label>
                      <Input
                        placeholder="e.g. Federal University Dutse"
                        value={form.institution}
                        onChange={e => set('institution', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Course of Study / Department</Label>
                      <Input
                        placeholder="e.g. Agriculture / Animal Science"
                        value={form.course_of_study}
                        onChange={e => set('course_of_study', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Duration / Period</Label>
                      <Input
                        placeholder="e.g. 6 Months, 1 Year"
                        value={form.duration_months}
                        onChange={e => set('duration_months', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Preferred Start Date</Label>
                      <Input
                        type="date"
                        value={form.start_date}
                        onChange={e => set('start_date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Documents */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-base font-bold text-slate-900">3. Attachments & Passport</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Passport Photograph (Optional)</Label>
                      <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setPassportFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="passport-input"
                        />
                        <label htmlFor="passport-input" className="cursor-pointer flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-emerald-700">
                            {passportFile ? passportFile.name : 'Choose Image File'}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>CV / Recommendation Letter (Optional)</Label>
                      <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={e => setDocumentFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="document-input"
                        />
                        <label htmlFor="document-input" className="cursor-pointer flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-emerald-700">
                            {documentFile ? documentFile.name : 'Choose Document (PDF/Word)'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-1.5 pt-2">
                  <Label>Statement of Interest / Cover Note</Label>
                  <Textarea
                    rows={4}
                    placeholder="Briefly state why you wish to do your SIWES, Internship or NYSC at EEFarm360..."
                    value={form.cover_letter}
                    onChange={e => set('cover_letter', e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitMut.isPending}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base py-6 shadow-md"
                >
                  {submitMut.isPending ? 'Submitting Application...' : 'Submit Application Now'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200">
        © 2026 Excellent Entrepreneurship Farm & Ranch Agro Ltd. All Rights Reserved.
      </footer>
    </div>
  );
}
