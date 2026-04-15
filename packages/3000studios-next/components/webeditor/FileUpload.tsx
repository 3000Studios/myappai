import React from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <p className="mb-2 text-xs text-gray-500">
          <span className="font-semibold">Click to upload</span>
        </p>
        <p className="text-[10px] text-gray-500">Any file type</p>
      </div>
      <input type="file" className="hidden" onChange={handleChange} />
    </label>
  );
};

