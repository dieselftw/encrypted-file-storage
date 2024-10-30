// components/FileUpload.js
import { UploadButton } from "@uploadthing/react";
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function FileUpload({ onUploadComplete }) {
  const handleUpload = async (res) => {
    if (res && res.length > 0) {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      for (const file of res) {
        await addDoc(collection(db, "files"), {
          userId: user.uid,
          fileName: file.name,
          fileUrl: file.url,
          timestamp: new Date()
        });
      }

      console.log("File(s) uploaded and metadata stored");
      onUploadComplete();
    }
  };

  return (
    <div className="mb-8 flex flex-col items-center">
    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Upload New File</h2>
    <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={handleUpload}
        onUploadError={(error) => {
        alert(`ERROR! ${error.message}`);
        }}
        appearance={{
        button: "ut-ready:bg-blue-500 bg-gray-600 ut-uploading:bg-blue-400 ut-uploaded:bg-green-500 rounded-md border-2 border-gray-300 bg-white px-6 py-3 text-lg font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ut-uploading:cursor-not-allowed",
        container: "w-full max-w-md",
        allowedContent: "text-sm text-gray-600 mt-2",
        uploadIcon: "w-6 h-6 text-blue-500 mb-2",
        }}
    />
    <p className="text-sm text-gray-500 mt-4">
        Max file size: 4MB. Supported formats: JPG, PNG, GIF.
    </p>
    </div>

  );
}
