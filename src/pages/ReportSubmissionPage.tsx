import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ArrowRight,
  ShieldAlert,
  Compass,
  Info
} from 'lucide-react';
import { ReportCategory, CivicReport } from '../types';
import { suggestCategory, calculatePriorityScore } from '../services/aiEngine';
import { storageService } from '../services/storageService';
import { CivicMap } from '../components/CivicMap';

interface ReportSubmissionPageProps {
  onReportCreated: (report: CivicReport, token: string) => void;
  onNavigate: (tab: string, reportId?: string) => void;
}

const CATEGORIES: ReportCategory[] = [
  'Roads and potholes',
  'Waterlogging and drainage',
  'Waste management',
  'Streetlights',
  'Water supply and leakage',
  'Electrical hazards',
  'Public infrastructure',
  'Sanitation',
  'Traffic and road safety',
  'Other'
];

export const ReportSubmissionPage: React.FC<ReportSubmissionPageProps> = ({
  onReportCreated,
  onNavigate
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Roads and potholes');
  const [latitude, setLatitude] = useState<number>(12.9716);
  const [longitude, setLongitude] = useState<number>(77.5946);
  const [address, setAddress] = useState('Central Civic Zone, MG Road Corridor');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{ report: CivicReport; token: string } | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Real-time AI preview state
  const [aiSuggestedCategory, setAiSuggestedCategory] = useState<ReportCategory>('Roads and potholes');
  const [aiPriorityPreview, setAiPriorityPreview] = useState<any>(null);

  useEffect(() => {
    if (description.trim().length >= 5) {
      const suggested = suggestCategory(title, description);
      setAiSuggestedCategory(suggested);
      const priority = calculatePriorityScore(category, title, description);
      setAiPriorityPreview(priority);
    } else {
      setAiPriorityPreview(null);
    }
  }, [title, description, category]);

  // Handle Photo Upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size exceeds 5MB limit.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Handle Map Pin Pick
  const handlePickCoordinates = (lat: number, lng: number) => {
    setLatitude(Number(lat.toFixed(6)));
    setLongitude(Number(lng.toFixed(6)));
    setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Metro District)`);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 10) {
      setError('Please provide a detailed description (at least 10 characters).');
      return;
    }
    if (!address.trim()) {
      setError('Please provide a valid location address or pick coordinates on the map.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await storageService.submitReport({
        title: title.trim() || undefined,
        description: description.trim(),
        category,
        latitude,
        longitude,
        address: address.trim(),
        imageFile: imageFile || undefined,
        reporterName: reporterName.trim() || undefined,
        reporterContact: reporterContact.trim() || undefined
      });

      setSubmittedData({ report: result.report, token: result.trackingToken });
      onReportCreated(result.report, result.trackingToken);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingToken = () => {
    if (submittedData) {
      navigator.clipboard.writeText(submittedData.token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  // SUCCESS CONFIRMATION MODAL / VIEW
  if (submittedData) {
    const { report, token } = submittedData;
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 animate-fade-in">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 sm:p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Civic Report Registered Successfully!
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm max-w-lg mx-auto">
              Your problem report has been analyzed by CivicAI's intelligence pipeline and queued for municipal resolution.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Tracking ID Badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                  Your Secure Tracking Token
                </span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-slate-900 tracking-wider">
                  {token}
                </span>
              </div>
              <button
                onClick={copyTrackingToken}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Copy className="w-4 h-4 text-teal-600" />
                <span>{copiedToken ? 'Copied to Clipboard!' : 'Copy Tracking Token'}</span>
              </button>
            </div>

            {/* AI Analysis Card */}
            {report.analysis && (
              <div className="border border-teal-100 bg-teal-50/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                      AI Issue Intelligence & Proposed Solution
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    report.priorityBand === 'Critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : report.priorityBand === 'High'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-teal-100 text-teal-800 border border-teal-200'
                  }`}>
                    {report.priorityBand} Priority ({report.priorityScore}/100)
                  </span>
                </div>

                {report.analysis.isSafetyOverride && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Safety Override Triggered</strong>
                      {report.analysis.priorityExplanation}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700">Executive Summary:</span>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {report.analysis.summary}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-teal-200/80 space-y-2">
                  <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                    Recommended Engineering Corrective Action:
                  </span>
                  <p className="text-xs text-slate-900 font-medium">
                    {report.analysis.proposedSolution}
                  </p>
                  
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Target Response: <strong>~{report.analysis.targetResponseHours} hours</strong></span>
                    <span>Department: <strong>{report.analysis.suggestedDepartmentCode}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('track', token)}
                className="w-full sm:w-1/2 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Track Progress Live</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('map')}
                className="w-full sm:w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Compass className="w-4 h-4 text-teal-600" />
                <span>View on City Map</span>
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setSubmittedData(null);
                  setTitle('');
                  setDescription('');
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
              >
                + Submit Another Civic Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REPORT SUBMISSION FORM VIEW
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Public Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Fast citizen intake under 60 seconds with instant AI analysis, priority rating, and tailored solutions.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Problem Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Problem Title (Optional — AI can generate automatically)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole causing accidents near Metro Pillar 142"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Problem Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {description.length} chars
              </span>
            </div>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is broken, dangerous, or disrupted. Include landmarks, severity, and any immediate danger..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"
            />

            {/* Real-time AI Assistant Badge */}
            {aiPriorityPreview && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-slate-700">
                    AI Suggested Category:
                  </span>
                  <button
                    type="button"
                    onClick={() => setCategory(aiSuggestedCategory)}
                    className="font-bold text-teal-700 hover:text-teal-900 underline"
                  >
                    {aiSuggestedCategory}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Estimated Priority:</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    aiPriorityPreview.band === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : aiPriorityPreview.band === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {aiPriorityPreview.band} ({aiPriorityPreview.score})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Problem Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(cat => {
                const isSelected = category === cat;
                const isAiRecommended = aiSuggestedCategory === cat && description.length >= 5;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all relative ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 border-teal-500 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {isAiRecommended && !isSelected && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500" title="AI Suggested" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Picker & Interactive Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Location & Coordinates <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Click map to select exact incident pin
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address or recognizable landmark"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 flex-shrink-0">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
              </div>
            </div>

            {/* Embedded interactive coordinate picker map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <CivicMap
                reports={[]}
                mode="picker"
                pickerCoordinates={{ lat: latitude, lng: longitude }}
                onPickLocation={handlePickCoordinates}
                height="260px"
              />
            </div>
          </div>

          {/* Optional Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Photograph / Evidence (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/30 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer transition-colors">
                <Camera className="w-4 h-4 text-teal-600" />
                <span>{imageFile ? 'Change Photo' : 'Upload Incident Photo'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-0 right-0 bg-slate-900/80 text-white w-4 h-4 flex items-center justify-center text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports JPEG, PNG, WebP up to 5MB. Photo is optional.
            </p>
          </div>

          {/* Optional Citizen Contact with Privacy Disclosure */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>Contact Details for SMS/Email Updates (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="Email or Mobile # (Optional)"
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              🔒 Privacy Guarantee: Your contact info is strictly confidential and never displayed on public tracking cards.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing through AI Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Civic Report & Generate Tracking Token</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};
