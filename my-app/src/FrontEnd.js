import { useState } from "react";
import { Search } from "lucide-react";

export default function JobSpanner() {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
        <h1 className="text-lg font-bold mb-4 text-center">JOBSPANNER</h1>

        {/* File Uploader */}
        <div className="border border-dashed border-gray-400 p-4 rounded-lg mb-4 text-center">
          <label className="cursor-pointer">
            <span className="block text-gray-600">File Uploader</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          {file && <p className="mt-2 text-sm text-gray-700">{file.name}</p>}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search Bar..."
            className="w-full p-2 border rounded pr-10"
          />
          <Search className="absolute right-3 top-3 text-gray-500" size={18} />
        </div>

        {/* Company Input */}
        <input
          type="text"
          placeholder="Company"
          className="w-full p-2 border rounded mb-4"
        />

        {/* Position Input */}
        <input
          type="text"
          placeholder="Position"
          className="w-full p-2 border rounded mb-4"
        />

        {/* Submit Button */}
        <button className="w-full p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </div>
    </div>
  );
}