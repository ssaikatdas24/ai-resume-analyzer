import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobDescription) {
      alert("Please upload a resume and paste the job description.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        navigate(`/session/${result.sessionId}`);
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">AI Resume Analyzer</h1>
        <form onSubmit={handleSubmit}>
            {/* ... (Keep the form from your original App.jsx here) ... */}
            {/* For brevity, I'm omitting the full form JSX. Just copy the <div class="grid..."> and its contents from the previous App.jsx */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Resume Upload */}
                {/* // client/src/pages/HomePage.jsx -> inside the return() statement */}


        <div>
        <label htmlFor="resume-upload" className="block text-lg font-medium text-gray-700">
            Upload Resume (PDF)
        </label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
                <label htmlFor="resume-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                {/* --- FIX IS HERE --- */}
                <span>Upload a file</span>
                <input id="resume-upload" name="resume-upload" type="file" className="sr-only" onChange={(e) => setResume(e.target.files[0])} accept=".pdf" />
                </label>
                <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF up to 10MB</p>
            {resume && <p className="text-sm text-green-600 mt-2">Selected: {resume.name}</p>}
            </div>
        </div>
        </div>
                {/* Job Description */}
                <div>
                <label htmlFor="job-description" className="block text-lg font-medium text-gray-700">Job Description</label>
                <textarea id="job-description" rows="10" className="shadow-sm mt-2 block w-full sm:text-sm border border-gray-300 rounded-md p-2" placeholder="Paste the job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></textarea>
                </div>
            </div>
            <div className="mt-8 text-center">
                <button type="submit" className="w-full md:w-auto inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300" disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
                </button>
            </div>
        </form>
    </div>
  );
}