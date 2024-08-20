import React, { useState, useRef } from 'react';
import { uploadImage } from '../services/thumbnailService';
import { Box, Button, Typography, Input, ImageList, ImageListItem, ImageListItemBar, CircularProgress } from '@mui/material';

const ImageUploader: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [thumbnailUrls, setThumbnailUrls] = useState<{ url: string; image: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Nuevo estado para gestionar el loading
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
            setLoading(true); // Mostrar el loader
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

                // Agrega la URL del thumbnail a la lista
                setThumbnailUrls((prevUrls) => [...prevUrls, { url, image }]);
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            } finally {
                setLoading(false); // Ocultar el loader después de la carga
            }
        }
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Input
                type="file"
                onChange={handleFileChange}
                inputRef={fileInputRef}
                sx={{ display: 'none' }} // Ocultar el input de archivo
            />
            <Button
                variant="contained"
                component="label" // El botón actuará como un contenedor para el input
                sx={{ mb: 2 }}
            >
                Seleccionar archivo
                <Input
                    type="file"
                    onChange={handleFileChange}
                    inputRef={fileInputRef}
                    sx={{ display: 'none' }} // Ocultar el input de archivo
                />
            </Button>

            {previewUrl && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Vista previa:</Typography>
                    <img
                        src={previewUrl}
                        alt="Vista previa"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                </Box>
            )}
            {selectedFile && !loading && ( // Mostrar el botón solo si hay un archivo seleccionado y no está cargando
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    sx={{ mb: 4 }}
                >
                    Subir Imagen
                </Button>
            )}
            {loading && ( // Mostrar el loader cuando esté cargando
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            <Typography variant="h6">Imágenes subidas:</Typography>
            <ImageList sx={{ width: '100%', height: 450 }}>
                {thumbnailUrls.map((item, index) => (
                    <ImageListItem key={index}>
                        <img
                            src={item.image}
                            alt={`Thumbnail ${index}`}
                            loading="lazy"
                            style={{ objectFit: 'cover' }} // Ajustar imagen para cubrir el área
                        />
                        <ImageListItemBar
                            title={`Thumbnail ${index}`}
                            subtitle={<span>{item.url}</span>}
                            position="below"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
};

export default ImageUploader;
