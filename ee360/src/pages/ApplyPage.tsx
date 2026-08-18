import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Link } from 'wouter';
import { CheckCircle2, AlertCircle, Upload, ArrowLeft } from 'lucide-react';
import ChatBotWidget from '@/components/ChatBotWidget';

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

  const { data: settings } = useQuery<PortalSettings>({
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
    if (!form.full_name || !form.email || !form.phone || !form.application_type) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-3 z-50 px-4 w-full max-w-4xl mx-auto">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full px-6 py-3 shadow-lg flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/FarmLogo.png" alt="EEFarm360 Logo" className="w-8 h-8 object-contain" />
            <span className="font-extrabold text-lg tracking-tight text-emerald-900 dark:text-white">EEFarm360</span>
          </Link>
          <Button variant="ghost" size="sm" className="rounded-full text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 text-xs font-semibold" asChild>
            <Link href="/">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 py-10">
        {/* Title & Banner */}
        <div className="text-center mb-8">
          <span className="inline-block bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3.5 py-1 rounded-full mb-3 tracking-wide uppercase">
            Official Application Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SIWES, Internship & NYSC Application
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Submit your application for industrial attachment, professional internship, or NYSC primary assignment at EEFarm360.
          </p>
        </div>

        {submitted ? (
          <Card className="border-emerald-200 bg-white dark:bg-slate-900 shadow-xl p-8 text-center space-y-5 rounded-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Application Submitted!</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Thank you, <strong className="text-slate-900 dark:text-white">{form.full_name}</strong>. Your application for <strong className="uppercase text-emerald-700 dark:text-emerald-400">{form.application_type}</strong> has been received.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-400 text-left space-y-1.5 border">
              <p>• <strong>Email:</strong> {form.email}</p>
              <p>• <strong>Phone:</strong> {form.phone}</p>
              <p>• <strong>Institution:</strong> {form.institution || 'N/A'}</p>
              <p>• <strong>Course:</strong> {form.course_of_study || 'N/A'}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setSubmitted(false)} variant="outline" className="text-xs">
                Submit Another Application
              </Button>
              <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </Card>
        ) : isAllClosed ? (
          <Card className="p-8 text-center space-y-4 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-200">Intake Currently Closed</h2>
            <p className="text-amber-800 dark:text-amber-300 text-sm max-w-md mx-auto">
              Application portals for SIWES, Internship, and NYSC are currently paused by administration. Please check back later.
            </p>
            <Button asChild className="bg-emerald-800 text-white text-xs">
              <Link href="/">Back to Home</Link>
            </Button>
          </Card>
        ) : (
          <Card className="shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-10 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Category Selection Dropdown */}
                <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <Label className="text-sm font-bold text-slate-900 dark:text-white">
                    Application Category *
                  </Label>
                  <Select
                    value={form.application_type}
                    onValueChange={(val) => set('application_type', val)}
                  >
                    <SelectTrigger className="w-full h-11 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Select Application Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="siwes" disabled={!isSiwesOpen}>
                        SIWES (Industrial Attachment) {!isSiwesOpen && '(Closed)'}
                      </SelectItem>
                      <SelectItem value="internship" disabled={!isInternshipOpen}>
                        Internship (Professional Training) {!isInternshipOpen && '(Closed)'}
                      </SelectItem>
                      <SelectItem value="nysc" disabled={!isNyscOpen}>
                        NYSC Corp Member (Primary Assignment) {!isNyscOpen && '(Closed)'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Select the program you are applying for at EEFarm360.
                  </p>
                </div>

                {/* 2. Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-wide uppercase text-emerald-800 dark:text-emerald-400">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-semibold">Full Name *</Label>
                      <Input
                        required
                        placeholder="Full Name (e.g. Ibrahim Abubakar)"
                        value={form.full_name}
                        onChange={e => set('full_name', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Email Address *</Label>
                      <Input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Phone Number *</Label>
                      <Input
                        required
                        placeholder="07012345678"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Academic & Internship Details */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold tracking-wide uppercase text-emerald-800 dark:text-emerald-400">
                    Academic & Duration Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Institution / University</Label>
                      <Input
                        placeholder="e.g. Federal University Dutse"
                        value={form.institution}
                        onChange={e => set('institution', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Course of Study</Label>
                      <Input
                        placeholder="e.g. Agriculture / Animal Science"
                        value={form.course_of_study}
                        onChange={e => set('course_of_study', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Duration / Period</Label>
                      <Select
                        value={form.duration_months}
                        onValueChange={(v) => set('duration_months', v)}
                      >
                        <SelectTrigger className="h-10 text-sm bg-slate-50 dark:bg-slate-800">
                          <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3 months">3 Months</SelectItem>
                          <SelectItem value="6 months">6 Months</SelectItem>
                          <SelectItem value="1 year">1 Year (NYSC)</SelectItem>
                          <SelectItem value="Custom">Other / Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Preferred Start Date</Label>
                      <Input
                        type="date"
                        value={form.start_date}
                        onChange={e => set('start_date', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Document Attachments */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold tracking-wide uppercase text-emerald-800 dark:text-emerald-400">
                    Attachments & Documents
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Passport Photo (Optional)</Label>
                      <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setPassportFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="passport-input"
                        />
                        <label htmlFor="passport-input" className="cursor-pointer flex flex-col items-center gap-1">
                          <Upload className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                            {passportFile ? passportFile.name : 'Choose Image File'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">CV / Recommendation Letter (Optional)</Label>
                      <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 text-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={e => setDocumentFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="document-input"
                        />
                        <label htmlFor="document-input" className="cursor-pointer flex flex-col items-center gap-1">
                          <Upload className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                            {documentFile ? documentFile.name : 'Choose Document (PDF/Word)'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Statement / Cover Note */}
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-semibold">Statement of Purpose / Additional Information</Label>
                  <Textarea
                    rows={3}
                    placeholder="Briefly state why you wish to join EEFarm360..."
                    value={form.cover_letter}
                    onChange={e => set('cover_letter', e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitMut.isPending}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm h-12 rounded-xl shadow-md transition-all"
                >
                  {submitMut.isPending ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        © 2026 Excellent Entrepreneurship Farm & Ranch Agro Ltd. All Rights Reserved.
      </footer>
      <ChatBotWidget />
    </div>
  );
}
