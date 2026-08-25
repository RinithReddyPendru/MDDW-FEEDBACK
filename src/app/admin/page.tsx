"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [feedbacks, setFeedbacks] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      alert("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password
      setIsAuthenticated(true);
      fetchFeedbacks();
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </main>
    );
  }

  const totalResponses = feedbacks.length;
  const ashaCount = feedbacks.filter(f => f.role?.includes('Asha')).length;
  const pwCount = feedbacks.filter(f => f.role?.includes('Pregnant')).length;
  
  // Calculate average rating (assuming q5 or q11 is the rating id, let's look for any rating answer)
  let totalRating = 0;
  let ratingCount = 0;
  feedbacks.forEach(f => {
    if (f.answers) {
      Object.values(f.answers as Record<string, string>).forEach((val: string) => {
        const num = parseInt(val);
        if (!isNaN(num) && num >= 1 && num <= 5 && val.length === 1) { // Basic heuristic for rating
          totalRating += num;
          ratingCount++;
        }
      });
    }
  });
  const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 'N/A';

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Feedback Analytics</h1>
          <button onClick={fetchFeedbacks} className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50 font-medium">
            Refresh Data
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Responses</p>
            <p className="text-4xl font-bold text-gray-900">{totalResponses}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Average Rating</p>
            <p className="text-4xl font-bold text-pink-600">{avgRating} <span className="text-2xl text-pink-300">★</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">ASHA / ANM</p>
            <p className="text-4xl font-bold text-blue-600">{ashaCount}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Pregnant Women</p>
            <p className="text-4xl font-bold text-emerald-600">{pwCount}</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Answers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">Loading feedback...</td>
                  </tr>
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">No feedback submitted yet.</td>
                  </tr>
                ) : (
                  feedbacks.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                        {f.createdAt?.toDate ? f.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-900">{f.name || 'Anonymous'}</td>
                      <td className="p-4 text-sm text-gray-600">{f.phone || 'N/A'}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${f.role?.includes('Asha') ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {f.role?.split(' (')[0] || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={JSON.stringify(f.answers)}>
                        {Object.entries(f.answers || {}).map(([key, val]) => `${key}: ${val}`).join(', ')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
