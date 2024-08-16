import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ThumbnailPreview from './components/ThumbnailPreview';
import { uploadImageAndGetThumbnails } from './services/thumbnailService';

const App: React.FC = () => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const handleFileSelect = async (file: File) => {
    try {
      const thumbnailUrls = await uploadImageAndGetThumbnails(file);
      setThumbnails(thumbnailUrls);
    } catch (error) {
      console.error("Error generating thumbnails:", error);
    }
  };

  return (
    <div>
      <h1>Thumbnail Generator</h1>
      <FileUpload onFileSelect={handleFileSelect} />
      <ThumbnailPreview thumbnails={thumbnails} />
    </div>
  );
};

export default App;
