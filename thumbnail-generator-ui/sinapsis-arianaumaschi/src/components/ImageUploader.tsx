import React, { useState, useRef, useCallback } from 'react';
import { uploadImage } from '../services/thumbnailService';
import { Box, Button, Typography, Input, ImageList, ImageListItem, ImageListItemBar, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageUploader: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [thumbnailUrls, setThumbnailUrls] = useState<{ url: string; image: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [crop, setCrop] = useState<Crop>({
        unit: '%', // Puede ser 'px' o '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50,
    });
    const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    const handleUpload = async () => {
        if (croppedImageUrl) {
            console.log("croppedImageUrl ok");
            setLoading(true);
            try {
                // Establecer la URL de vista previa recortada
                setPreviewUrl(croppedImageUrl);

                // Verificar si selectedFile está disponible y válido antes de continuar
                if (!selectedFile) {
                    throw new Error('No se ha seleccionado ningún archivo.');
                }

                // Limpiar el valor del input de archivo
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                // Convertir la URL de la imagen recortada en un archivo
                const croppedFile = await fetch(croppedImageUrl)
                    .then((r) => r.blob())
                    .then((blobFile) => new File([blobFile], selectedFile.name, { type: selectedFile.type }));

                // Subir la imagen recortada
                const { url, image } = await uploadImage(croppedFile);

                setThumbnailUrls((prevUrls) => [...prevUrls, { url, image }]);
                setCroppedImageUrl(null)
                setCompletedCrop(null)
                setPreviewUrl(null)
                setSelectedFile(null)
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.error('Error: No se ha recortado ninguna imagen.');
        }
    };

    const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const img = e.currentTarget; // Accedes al elemento img desde el evento
        // Resto del código para manejar la imagen cargada
    };

    const onCropComplete = (crop: Crop) => {
        setCompletedCrop(crop);
    };

    const onCropChange = (crop: Crop) => {
        setCrop(crop);
    };

    const generateCroppedImage = useCallback(() => {
        console.log('generating')
        console.log('Estado de completedCrop:', completedCrop);
        console.log('Estado de imageRef.current:', imageRef.current);
        if (!completedCrop || !imageRef.current) {
            console.log('completedCrop o imageRef.current son inválidos');

            return;
        }
        console.log('Intentando crear el canvas');
        const canvas = document.createElement('canvas');
        console.log(canvas); // Verificar si el canvas fue creado

        const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
        const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
        canvas.width = completedCrop.width!;
        canvas.height = completedCrop.height!;
        const ctx = canvas.getContext('2d');

        if (ctx) {

            ctx.drawImage(
                imageRef.current,
                completedCrop.x! * scaleX,
                completedCrop.y! * scaleY,
                completedCrop.width! * scaleX,
                completedCrop.height! * scaleY,
                0,
                0,
                completedCrop.width!,
                completedCrop.height!
            );

            canvas.toBlob((blob) => {
                console.log(blob);
                if (blob) {
                    setCroppedImageUrl(URL.createObjectURL(blob));
                    console.log(croppedImageUrl)
                }
            }, 'image/jpeg');
        }
    }, [completedCrop]);


    const handleFileDrop = (file: File) => {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileDrop(e.dataTransfer.files[0]);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            p: 2,
            borderRadius: 2,
            textAlign: 'center',
            mt: 4,
            backgroundColor: isDragging ? 'lightblue' : 'aqua',
            border: isDragging ? '2px dashed #000' : '2px solid #000',
            transition: 'background-color 0.3s, border 0.3s',
            cursor: 'pointer',
        }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {isDragging ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo o selecciona uno'}
            </Typography>

            <Input type="file" onChange={handleFileChange} inputRef={fileInputRef} sx={{ display: 'none' }} />
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Seleccionar archivo
                <Input type="file" onChange={handleFileChange} inputRef={fileInputRef} sx={{ display: 'none' }} />
            </Button>

            {previewUrl && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Recortar Imagen:</Typography>
                    <ReactCrop
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                    >
                        <img
                            ref={imageRef}
                            src={previewUrl}
                            alt="Preview"
                            onLoad={onImageLoaded}
                        />
                    </ReactCrop>
                    <Button variant="contained" color="primary" onClick={generateCroppedImage} sx={{ mt: 2 }}>
                        Generar Imagen Recortada
                    </Button>
                </Box>
            )}

            {croppedImageUrl && completedCrop && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Vista previa de la imagen recortada:</Typography>
                    <img src={croppedImageUrl} alt="Cropped Preview" style={{ maxWidth: '100%', maxHeight: '40vh' }} />
                </Box>
            )}

            {croppedImageUrl && !loading && (
                <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mb: 4 }}>
                    Subir Imagen Recortada
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
    );
};

export default ImageUploader;
