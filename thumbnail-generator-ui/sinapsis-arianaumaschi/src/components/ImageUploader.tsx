import React, { useState, useRef } from 'react';
import { uploadImage } from '../services/thumbnailService';
import { Box, Button, Typography, Input, ImageList, ImageListItem, ImageListItemBar, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { DndContext, useDroppable } from '@dnd-kit/core';

const ImageUploader: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [thumbnailUrls, setThumbnailUrls] = useState<{ url: string; image: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Dnd-kit: Setup for droppable area
    const { isOver, setNodeRef } = useDroppable({
        id: 'dropzone',
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            setLoading(true);
            try {
                setPreviewUrl(null);
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                const { url, image } = await uploadImage(selectedFile);
                setThumbnailUrls((prevUrls) => [...prevUrls, { url, image }]);
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle file drop
    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <DndContext>
            <Box
                ref={setNodeRef} // Reference for the droppable area
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    p: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    mt: 4,
                    backgroundColor: isOver ? 'lightblue' : 'aqua', // Change color when dragging over
                    border: isOver ? '2px dashed #000' : '2px solid #000', // Change border style when dragging over
                    transition: 'background-color 0.3s, border 0.3s', // Smooth transition for feedback
                }}
                onDragOver={(e) => e.preventDefault()} // Prevent default to allow drop
                onDrop={handleFileDrop} // Handle file drop
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {isOver ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo o selecciona uno'}
                </Typography>

                <Input
                    type="file"
                    onChange={handleFileChange}
                    inputRef={fileInputRef}
                    sx={{ display: 'none' }}
                />
                <Button
                    variant="contained"
                    component="label"
                    sx={{ mb: 2 }}
                >
                    Seleccionar archivo
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        inputRef={fileInputRef}
                        sx={{ display: 'none' }}
                    />
                </Button>

                {previewUrl && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Vista previa:</Typography>
                        <img
                            src={previewUrl}
                            alt="Vista previa"
                            style={{ maxWidth: '100%', maxHeight: '40vh' }}
                        />
                    </Box>
                )}

                {selectedFile && !loading && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        sx={{ mb: 4 }}
                    >
                        Subir Imagen
                    </Button>
                )}

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderTop: '10px solid red',
                        backgroundColor: 'pink',
                        p: 2,
                        maxWidth: '100%',
                    }}
                >
                    <Typography variant="h6">Imágenes subidas:</Typography>
                    <ImageList
                        sx={{
                            maxWidth: '100%',
                            height: 'auto',
                            backgroundColor: 'orange',
                        }}
                        cols={isMobile ? 1 : (isTablet ? 2 : 2)}
                    >
                        {thumbnailUrls.map((item, index) => (
                            <ImageListItem
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    border: '4px solid black'
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={`Thumbnail ${index}`}
                                    loading="lazy"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        width: 'auto',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        border: '2px solid blue',
                                    }}
                                />
                                <ImageListItemBar
                                    title={`Thumbnail ${index}`}
                                    subtitle={<span>{item.url}</span>}
                                    position="below"
                                    sx={{
                                        backgroundColor: 'gold', textAlign: 'center', maxWidth: '70%',
                                    }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            </Box>
        </DndContext>
    );
};

export default ImageUploader;
