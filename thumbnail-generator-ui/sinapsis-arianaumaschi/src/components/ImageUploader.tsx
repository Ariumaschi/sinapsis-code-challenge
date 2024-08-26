import React, { useState, useRef, useCallback } from 'react';
import { uploadImage } from '../services/thumbnailService';
import { Box, Button, Typography, Input, ImageList, Divider, ImageListItem, ImageListItemBar, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImagesGallery from './ImagesGallery';


const ImageUploader: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [thumbnailUrls, setThumbnailUrls] = useState<{ url: string; image: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [editImage, setEditImage] = useState<boolean>(false);

    const [crop, setCrop] = useState<Crop>({
        unit: 'px', // Puede ser 'px' o '%'
        x: 0,
        y: 0,
        width: 100,
        height: 100,
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
    const handleCroppedUpload = async () => {
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

    const onImageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const image = event.currentTarget; // Acceder al elemento de imagen
        imageRef.current = image;

        const { width, height } = image;
        console.log(image)
        setCrop({
            unit: 'px',
            width: width,
            height: height,
            x: 0,
            y: 0
        });
        setCompletedCrop({
            unit: 'px',
            width: width,
            height: height,
            x: 0,
            y: 0
        });
        return false; // No es necesario, puedes eliminar esto si no lo necesitas
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
        <Box
            sx={{
                width: '100%',
                minHeight: '80vh',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f2f2f2',
                boxSizing: 'border-box'
            }}
        >          <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: 800,
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                mt: 4,
                backgroundColor: isDragging ? '#f7e6b4' : '#f2f2f2',
                border: isDragging ? '2px dashed black' : '2px solid black',
                transition: 'background-color 0.3s, border 0.3s',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                minHeight: '350px',
                justifyContent: 'center',
                boxSizing: 'border-box',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
                    {isDragging ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo o selecciona uno'}
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => setPreviewUrl(null)}

                    component="label"
                    sx={{
                        mb: 3,
                        bgcolor: '#FFC80F',
                        '&:hover': {
                            bgcolor: '#f7e6b4',
                        },
                        color: 'black',
                        borderRadius: 4,
                        textTransform: 'capitalize'
                    }}
                >
                    Seleccionar archivo
                    <Input type="file" onChange={handleFileChange} inputRef={fileInputRef} sx={{ display: 'none' }} />
                </Button>


                <Box sx={{ mb: 2 }}>
                    {/* Mostrar la vista previa si hay previewUrl y editImage es falso */}
                    {previewUrl && !editImage && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6">Vista previa:</Typography>
                            <img
                                src={previewUrl}
                                alt="Vista previa"
                                style={{ maxWidth: '100%', maxHeight: '40vh' }}
                            />
                            <Box sx={{ mb: 3, width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2%' }}>
                                <Button
                                    onClick={() => setEditImage(true)}
                                    variant="contained"
                                    component="label"
                                    sx={{
                                        mb: 3,
                                        bgcolor: '#FFC80F',
                                        '&:hover': {
                                            bgcolor: '#f7e6b4',
                                        },
                                        color: 'black',
                                        borderRadius: 4,
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    Editar Imagen
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpload}
                                    sx={{
                                        mb: 3,
                                        bgcolor: '#FFC80F',
                                        '&:hover': {
                                            bgcolor: '#f7e6b4',
                                        },
                                        color: 'black',
                                        borderRadius: 4,
                                        textTransform: 'capitalize'
                                    }}     >
                                    Subir Imagen
                                </Button>
                            </Box>
                        </Box>

                    )}

                    {/* Mostrar el recorte de imagen si hay previewUrl y editImage es verdadero */}
                    {previewUrl && editImage && (
                        <Box sx={{ mb: 3, width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}>
                                Recortar Imagen:
                            </Typography>
                            <ReactCrop
                                crop={crop}
                                onChange={(newCrop) => setCrop(newCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                            >
                                <img
                                    ref={imageRef}
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{ width: '100%', borderRadius: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}
                                    onLoad={onImageLoaded}
                                />
                            </ReactCrop>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={generateCroppedImage}
                                sx={{
                                    mb: 3,
                                    bgcolor: '#FFC80F',
                                    '&:hover': {
                                        bgcolor: '#f7e6b4',
                                    },
                                    color: 'black',
                                    borderRadius: 4,
                                    textTransform: 'capitalize',
                                    marginTop: '2%'
                                }}
                            >
                                Generar Imagen Recortada
                            </Button>
                        </Box>
                    )}
                </Box>



                {croppedImageUrl && (
                    <Box sx={{ mb: 3, width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}>
                            Vista previa de la imagen recortada:
                        </Typography>
                        <img
                            src={croppedImageUrl}
                            alt="Cropped Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '50vh',
                                borderRadius: 4,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    </Box>
                )}

                {croppedImageUrl && !loading && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCroppedUpload}
                        sx={{
                            mb: 3,
                            bgcolor: '#FFC80F',
                            '&:hover': {
                                bgcolor: '#f7e6b4',
                            },
                            color: 'black',
                            borderRadius: 4,
                            textTransform: 'capitalize'
                        }}     >
                        Subir Imagen Recortada
                    </Button>
                )}

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>

            <Divider sx={{ my: 4, width: '100%', maxWidth: 800 }} />

            {/* Sección independiente para imágenes subidas */}
            <Box sx={{ mt: 4, width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <ImagesGallery thumbnailUrls={thumbnailUrls} />
            </Box>
        </Box>
    );
};

export default ImageUploader;
