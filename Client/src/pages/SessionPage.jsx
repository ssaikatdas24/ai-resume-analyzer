import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy } from 'lucide-react';

export default function SessionPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rewriting, setRewriting] = useState({});

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/session/${id}`);
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const handleRewrite = async (bullet, index) => {
    setRewriting({ ...rewriting, [index]: true });
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/rewrite`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: bullet }),
      });
      const data = await res.json();
      // Update the specific bullet in the UI
      const newBullets = [...session.parsedSections.experience.split('\n')];
      newBullets[index] = data.rewrittenText;
      setSession({ ...session, parsedSections: {...session.parsedSections, experience: newBullets.join('\n')}});
    } catch (error) {
      console.error("Failed to rewrite:", error);
    } finally {
      setRewriting({ ...rewriting, [index]: false });
    }
  };

  if (loading) return <div className="text-center p-10">Loading results...</div>;
  if (!session) return <div className="text-center p-10">Session not found.</div>;

  const matchingKeywords = session.keywords.resumeKeywords.filter(k => session.keywords.jdKeywords.includes(k));
  const missingKeywords = session.keywords.jdKeywords.filter(k => !session.keywords.resumeKeywords.includes(k));

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Analysis Results</h1>
        <Link to="/" className="text-indigo-600 hover:underline mb-8 block">&larr; Analyze Another Resume</Link>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <ScoreCard title="Overall Match" score={session.scores.overall} />
            <ScoreCard title="Skills Match" score={session.scores.skills} />
            <ScoreCard title="Experience Match" score={session.scores.experience} />
        </div>

        {/* Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <KeywordCard title="Matching Keywords" keywords={matchingKeywords} color="green" />
            <KeywordCard title="Missing Keywords" keywords={missingKeywords} color="red" />
        </div>

        {/* Suggestions */}
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rewrite Suggestions</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold mb-2">Experience Section Bullets</h3>
                <ul className="list-disc pl-5 space-y-4">
                    {(session.parsedSections.experience || "").split('\n').filter(b => b.trim().length > 5).map((bullet, index) => (
                        <li key={index} className="text-gray-700">
                            {bullet}
                            <button onClick={() => handleRewrite(bullet, index)} disabled={rewriting[index]} className="ml-4 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 disabled:opacity-50">
                                {rewriting[index] ? 'Rewriting...' : '✨ Rewrite'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
}

const ScoreCard = ({ title, score }) => (
    <div className="bg-white p-6 rounded-lg shadow text-center">
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <p className={`text-5xl font-bold ${score > 75 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{score}<span className="text-2xl text-gray-400">/100</span></p>
    </div>
);

const KeywordCard = ({ title, keywords, color }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className={`text-xl font-semibold text-gray-800 mb-4 border-b pb-2`}>{title}</h3>
        <div className="flex flex-wrap gap-2">
            {keywords.map(k => <span key={k} className={`px-3 py-1 text-sm font-medium rounded-full bg-${color}-100 text-${color}-800`}>{k}</span>)}
        </div>
    </div>
);