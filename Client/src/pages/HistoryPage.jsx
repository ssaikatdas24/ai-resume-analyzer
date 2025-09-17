import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data));
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Analysis History</h1>
        <div className="bg-white rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
                {sessions.map(session => (
                    <li key={session._id}>
                        <Link to={`/session/${session._id}`} className="block hover:bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-md font-medium text-indigo-600 truncate">Session {session._id}</p>
                                <p className="text-md text-gray-900">{session.scores.overall}/100</p>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Analyzed on {new Date(session.createdAt).toLocaleString()}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
}