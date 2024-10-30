"use client";

import { useState } from 'react';
import { UploadButton } from "@uploadthing/react";
import { encryptFile } from '@/lib/encryption';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function FileUpload() {
  const [file, setFile] = useState(null);

  const handleUpload = async (res) => {
    if (res && res[0]) {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const encryptionKey = Math.random().toString(36).substring(2, 15);
      const encryptedContent = encryptFile(res[0].url, encryptionKey);

      await addDoc(collection(db, "files"), {
        userId: user.uid,
        fileName: res[0].name,
        fileUrl: encryptedContent,
        encryptionKey: encryptionKey,
        timestamp: new Date()
      });

      console.log("File uploaded and metadata stored");
    }
  };

  return (
    <div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={handleUpload}
        onUploadError={(error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}
