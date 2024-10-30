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
          button: "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-all hover:bg-gray-50 ut-uploading:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          allowedContent: "text-sm text-gray-600 mt-2",
          container: "w-full max-w-md"
        }}
      />
      <p className="text-sm text-gray-500 mt-2">
        Max file size: 4MB. Supported formats: JPG, PNG, GIF.
      </p>
    </div>
  );
}
