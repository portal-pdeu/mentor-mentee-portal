"use server";

import React from 'react';
import studentServerServices from '@/backend-services/Student-server';
import { getStudentImageUrl, getInitials } from '@/lib/imageUtils';

const creatorRolls = ['22BCP377', '22BCP411'];

export default async function CreatorsPage() {
  // Fetch creators
  let creators: any[] = [];
  try {
    const all = await studentServerServices.getAllStudents();
    creators = all.filter((s: any) => creatorRolls.includes(s.rollNo));
  } catch (err) {
    console.error('Error fetching creators from students list:', err);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Project Team</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Discover the talented individuals behind this innovative project management platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {creators.length === 0 && (
            <div className="text-sm text-gray-500">No creators found for the specified roll numbers.</div>
          )}

          {creators.map((c) => {
            const src = c.imageUrl ? c.imageUrl : c.imageId ? getStudentImageUrl(c.imageId) : null;
            const initials = getInitials(c.name || (c.rollNo ?? ''));

            return (
              <div key={c.rollNo} className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg overflow-hidden">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={c.name} className="h-28 w-28 rounded-full object-cover ring-4 ring-white shadow" />
                    ) : (
                      <div className="h-28 w-28 rounded-full flex items-center justify-center ring-4 ring-white shadow bg-gradient-to-br from-indigo-500 to-pink-400 text-lg font-semibold text-white">
                        {initials}
                      </div>
                    )}

                    <span className="absolute -right-1 bottom-1 inline-block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white" aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{c.name}</h2>
                    <p className="text-sm text-indigo-600 mt-1">{c.department ? `${c.department} @ ${c.school || ''}` : c.rollNo}</p>
                    <p className="text-sm text-gray-600 mt-3">{c.email || 'Email not provided'}</p>

                    <p className="text-gray-500 text-sm mt-4">Passionate about creating innovative solutions and modern web applications.</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Next.js</span>
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">TypeScript</span>
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Tailwind CSS</span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <a href={c.email ? `mailto:${c.email}` : '#'} className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Contact
                      </a>

                      <a href="#" className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 10l4.553-2.276A2 2 0 0122 9.618V17a2 2 0 01-2 2h-6v-9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
