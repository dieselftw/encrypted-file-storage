'use client'

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import FileList from './components/FileList';
import FileUpload from './components/FileUpload';

export default function Home() {
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Please sign in to use the application.</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">AES Encrypted File Storage</h1>
        <FileUpload onUploadComplete={handleUploadComplete} />
        <FileList refreshTrigger={refreshTrigger} />
      </div>
    </main>
  );
}