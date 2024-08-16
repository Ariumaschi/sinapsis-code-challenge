import React from 'react';

interface ThumbnailPreviewProps {
  thumbnails: string[];
}

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ thumbnails }) => {
  return (
    <div>
      {thumbnails.map((url, index) => (
        <div key={index}>
          <img src={url} alt={`Thumbnail ${index + 1}`} style={{ width: '100px', margin: '10px' }} />
          <p>{url}</p>
        </div>
      ))}
    </div>
  );
};

export default ThumbnailPreview;
