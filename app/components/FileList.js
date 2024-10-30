"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { decryptFile } from '@/lib/encryption';

export default function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "files"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setFiles(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchFiles();
  }, []);

  const handleDecrypt = async (file) => {
    const decryptedContent = decryptFile(file.fileUrl, file.encryptionKey);
    
    const blob = new Blob([decryptedContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Files</h2>
      <ul>
        {files.map(file => (
          <li key={file.id} className="mb-2">
            {file.fileName}
            <button onClick={() => handleDecrypt(file)} className="ml-4 bg-green-500 text-white px-2 py-1 rounded">
              Decrypt and Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
