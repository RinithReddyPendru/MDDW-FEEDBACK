/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ashaQuestions, pwQuestions } from '@/lib/questions';

const COLORS = ['#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#3b82f6', '#ef4444'];


export default function AdminDashboard() {
  
  
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ASHA' | 'PW'>('ASHA');
  

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




  const handleDownloadCSV = (targetGroup: 'ASHA' | 'PW') => {
    const targetFeedbacks = feedbacks.filter(f => {
      const roleStr = String(f.role || '');
      if (targetGroup === 'ASHA') return roleStr.includes('Asha') || roleStr.includes('ANM');
      if (targetGroup === 'PW') return roleStr.includes('Pregnant');
      return false;
    });

    if (targetFeedbacks.length === 0) {
      alert(`No data found for ${targetGroup === 'ASHA' ? 'ASHA/ANM' : 'Pregnant Women'} yet.`);
      return;
    }

    const answerKeys = new Set<string>();
    targetFeedbacks.forEach(f => {
      if (f.answers) {
        Object.keys(f.answers).forEach(k => answerKeys.add(k));
      }
    });
    
    // Sort keys intelligently so q2 comes before q10
    const dynamicHeaders = Array.from(answerKeys).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });

    const headers = ['Date', 'Role', 'Name', 'Phone', ...dynamicHeaders];
    const csvRows = [];
    csvRows.push(headers.join(',')); // Header row

    targetFeedbacks.forEach(f => {
      const dateStr = f.createdAt?.toDate ? f.createdAt.toDate().toLocaleDateString() : 'N/A';
      const role = `"${(f.role || '').replace(/"/g, '""')}"`;
      const name = `"${(f.name || '').replace(/"/g, '""')}"`;
      const phone = `"${(f.phone || '').replace(/"/g, '""')}"`;
      
      const row = [dateStr, role, name, phone];
      
      dynamicHeaders.forEach(key => {
         let val = f.answers?.[key] || '';
         val = val.replace(/"/g, '""'); // escape quotes
         row.push(`"${val}"`);
      });

      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileNameGroup = targetGroup === 'ASHA' ? 'ASHA_ANM' : 'Pregnant_Women';
    link.setAttribute('download', `JananiMitra_${fileNameGroup}_Feedback_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const totalResponses = feedbacks.length;
  const ashaCount = feedbacks.filter(f => (f.role as string)?.includes('Asha')).length;
  const pwCount = feedbacks.filter(f => (f.role as string)?.includes('Pregnant')).length;
  
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
          <div className="flex flex-wrap gap-3 items-center justify-end">
            <button onClick={() => handleDownloadCSV('ASHA')} disabled={feedbacks.length === 0} className="px-4 py-2 bg-blue-600 text-white shadow-sm rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              ASHA / ANM CSV
            </button>
            <button onClick={() => handleDownloadCSV('PW')} disabled={feedbacks.length === 0} className="px-4 py-2 bg-emerald-600 text-white shadow-sm rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50 transition-colors flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Pregnant Women CSV
            </button>
            <button onClick={fetchFeedbacks} className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50 font-medium transition-colors text-gray-700 text-sm">
              Refresh Data
            </button>
          </div>
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

        
        {/* Analysis Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b border-gray-200 mb-6 pb-2">
            <button 
              onClick={() => setActiveTab('ASHA')}
              className={`pb-2 px-1 font-semibold text-lg transition-colors ${activeTab === 'ASHA' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              ASHA / ANM Analysis
            </button>
            <button 
              onClick={() => setActiveTab('PW')}
              className={`pb-2 px-1 font-semibold text-lg transition-colors ${activeTab === 'PW' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Pregnant Women Analysis
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(activeTab === 'ASHA' ? ashaQuestions : pwQuestions).map((q) => {
              // Aggregate data
              const counts: Record<string, number> = {};
              feedbacks.forEach(f => {
                const roleStr = String(f.role || '');
                if (activeTab === 'ASHA' && !(roleStr.includes('Asha') || roleStr.includes('ANM'))) return;
                if (activeTab === 'PW' && !roleStr.includes('Pregnant')) return;
                
                if (f.answers && f.answers[q.id]) {
                  const ans = f.answers[q.id];
                  counts[ans] = (counts[ans] || 0) + 1;
                }
              });

              const chartData = Object.keys(counts).map(key => ({
                name: key.length > 40 ? key.substring(0, 40) + '...' : key,
                fullName: key,
                value: counts[key]
              }));

              return (
                <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <h3 className="text-gray-800 font-semibold mb-4 text-sm whitespace-pre-wrap">{q.text}</h3>
                  {chartData.length > 0 ? (
                    <div className="flex-grow h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: any) => [`${value} responses`, 'Count']}
                            labelFormatter={(label, payload) => {
                               if (payload && payload.length > 0) return payload[0].payload.fullName;
                               return label;
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-400 italic text-sm">
                      No data available yet
                    </div>
                  )}
                </div>
              );
            })}
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
                  
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400">Loading feedback...</td>
                  </tr>
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400">No feedback submitted yet.</td>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${(f.role as string)?.includes('Asha') ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {(f.role as string)?.split(' (')[0] || 'N/A'}
                        </span>
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
