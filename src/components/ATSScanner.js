import React, { useState, useRef } from 'react';
import { extractTextFromPDF } from './utils/extractTextFromPDF';
import { extractKeywords } from './utils/extractKeywords';

export default function ATSScanner() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('matched');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleScan = async () => {
    if (!file || !jobDesc) return;
    setLoading(true);

    try {
      const resumeText = await extractTextFromPDF(file);
      const resumeKW = extractKeywords(resumeText);
      const jobKW = extractKeywords(jobDesc);

      const matchedKW = jobKW.keywords.filter(k => resumeKW.keywords.includes(k));
      const missingKW = jobKW.keywords.filter(k => !resumeKW.keywords.includes(k));
      const matchPercentage = Math.round((matchedKW.length / jobKW.keywords.length) * 100);

      setResults({
        score: matchPercentage,
        matched: matchedKW,
        missing: missingKW,
        resumeKeywords: resumeKW.keywords,
        jobKeywords: jobKW.keywords,
        categories: jobKW.categories,
        frequency: jobKW.frequency
      });
    } catch (error) {
      console.error('Scanning error:', error);
      alert('Error scanning documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setJobDesc('');
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = results?.score >= 70 ? 'from-green-400 to-green-600' : 
                    results?.score >= 40 ? 'from-yellow-400 to-yellow-600' : 
                    'from-red-400 to-red-600';

  return (
    <div className="min-h-screen bg-gray-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-black p-6 text-white">
            <h1 className="text-3xl font-bold">📄 ATS Resume Optimizer</h1>
            <p className="opacity-90">Get your software engineering resume past automated tracking systems</p>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Upload Documents</h2>
                {results && (
                  <button 
                    onClick={reset}
                    className="text-sm text-blue-600 hover:text-blue-800 transition flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                  </button>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={e => setFile(e.target.files[0])}
                  className="hidden"
                />
                {file ? (
                  <div className="text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to change</p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p>Drag & drop your resume (PDF)</p>
                    <p className="text-xs mt-1">or click to browse</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea
                  rows="8"
                  placeholder="Paste the job description here..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <button
                onClick={handleScan}
                disabled={loading || !file || !jobDesc}
                style={{cursor: 'pointer'}}
                className={`w-full py-3 px-6  rounded-lg font-medium text-white transition-all flex items-center justify-center ${
                  loading ? 'bg-blue-400' : 'bg-black hover:bg-gray-700 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Scan Resume
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            {results ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan Results</h2>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Match Score</span>
                      <span className="text-lg font-bold">{results.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full bg-gradient-to-r ${scoreColor} transition-all duration-1000 ease-out`}
                        style={{ width: `${results.score}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{results.matched.length}</div>
                      <div className="text-xs text-green-800">Matched</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{results.missing.length}</div>
                      <div className="text-xs text-red-800">Missing</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.jobKeywords.length}</div>
                      <div className="text-xs text-blue-800">Total Keywords</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      className={`py-2 px-4 font-medium ${activeTab === 'matched' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab('matched')}
                    >
                      ✅ Matched ({results.matched.length})
                    </button>
                    <button
                      className={`py-2 px-4 font-medium ${activeTab === 'missing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab('missing')}
                    >
                      ❌ Missing ({results.missing.length})
                    </button>
                  </div>

                  <div className="h-64 overflow-y-auto">
                    {activeTab === 'matched' ? (
                      <div className="grid grid-cols-2 gap-2">
                        {results.matched.map((kw, i) => (
                          <div key={i} className="bg-green-50 text-green-800 px-3 py-2 rounded-md text-sm flex justify-between items-center">
                            <span className="capitalize">{kw}</span>
                            <span className="text-xs bg-green-100 px-2 py-1 rounded-full">
                              {results.frequency[kw] || 1}x
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {results.missing.map((kw, i) => (
                          <div key={i} className="bg-red-50 text-red-800 px-3 py-2 rounded-md text-sm flex justify-between items-center">
                            <span className="capitalize">{kw}</span>
                            <button
                              onClick={() => copyToClipboard(kw)}
                              className="text-xs text-blue-600 hover:text-blue-800 transition"
                            >
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {activeTab === 'missing' && results.missing.length > 0 && (
                    <button
                      onClick={() => copyToClipboard(results.missing.join(', '))}
                      className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition"
                    >
                      Copy All Missing Keywords
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-3">Keyword Categories</h3>
                  <div className="space-y-3">
                    {Object.entries(results.categories).map(([category, percentage]) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-gray-700">{category}</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center p-12">
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-medium">Your scan results will appear here</p>
                  <p className="text-sm mt-1">Upload your resume and job description to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}