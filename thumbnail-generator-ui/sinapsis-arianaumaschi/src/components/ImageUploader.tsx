import React, { useState, useRef } from 'react';
import { uploadImage } from '../services/thumbnailService';

const ImageUploader: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [thumbnailUrls, setThumbnailUrls] = useState<{ url: string; image: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            try {
                // Limpia la vista previa y el archivo seleccionado
                setPreviewUrl(null);
                setSelectedFile(null);
                // Limpiar el input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }


                // Simula la subida de la imagen y obtiene la URL
                const { url, image } = await uploadImage(selectedFile);

                console.log(url, image);

                // Agrega la URL del thumbnail a la lista
                setThumbnailUrls((prevUrls) => [...prevUrls, { url, image }]);
                console.log(thumbnailUrls);
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} ref={fileInputRef} // Referencia al input
            />
            {previewUrl && (
                <div>
                    <h3>Vista previa:</h3>
                    <img src={previewUrl} alt="Vista previa" style={{ width: '200px' }} />
                </div>
            )}
            <button onClick={handleUpload}>Subir Imagen</button>
            <h3>Imágenes subidas:</h3>
            <ul>
                {thumbnailUrls.map((item, index) => (
                    <li key={index}>
                        <p>{item.url}</p>
                        <img src={item.image} alt={`Thumbnail ${index}`} style={{ width: '100px' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ImageUploader;
