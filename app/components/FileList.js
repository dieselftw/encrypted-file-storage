// components/FileList.js
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function FileList({ refreshTrigger }) {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "files"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    setFiles(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file. Please try again.");
    }
  };

  const handleDelete = async (file) => {
    try {
      await deleteDoc(doc(db, "files", file.id));
      alert("File deleted successfully");
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-black">Your Files</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">File Name</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id} className="border-b hover:bg-gray-100">
              <td className="p-2">{file.fileName}</td>
              <td className="p-2">
                <button 
                  onClick={() => handleDownload(file)} 
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Download
                </button>
                <button 
                  onClick={() => handleDelete(file)} 
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
