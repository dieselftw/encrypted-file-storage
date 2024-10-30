"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase'
import SignIn from './components/SignIn';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  if (!user) {
    return <SignIn />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Encrypted File Storage</h1>
      <FileUpload />
      <FileList />
      <button onClick={() => auth.signOut()} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Sign Out</button>
    </main>
  );
}
