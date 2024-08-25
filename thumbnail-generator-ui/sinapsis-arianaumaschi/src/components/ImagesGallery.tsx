import React from 'react';
import { Box, Typography, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';

interface ImagesGalleryProps {
    thumbnailUrls: { url: string; image: string }[];
}

const ImagesGallery: React.FC<ImagesGalleryProps> = ({ thumbnailUrls }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#rgba(165, 214, , 0.3)',  
                p: 4,
                width: '100%',
                borderTop: `2px dashed black `,  
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}>
                Imágenes Subidas
            </Typography>
            <ImageList
                sx={{
                    width: '100%',
                    maxWidth: 1200,
                    height: 'auto',
                    backgroundColor: 'transparent', // Fondo transparente para no sobrecargar el diseño
                }}
                cols={isMobile ? 1 : (isTablet ? 2 : 3)} // Ajustar el número de columnas
            >
                {thumbnailUrls.map((item, index) => (
                    <ImageListItem
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            border: `4px solid black`, // Usar color primario del tema
                            borderRadius: 2,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Suave sombra para un toque moderno
                        }}
                    >
                        <img
                            src={item.image}
                            alt={`Thumbnail ${index}`}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                                borderRadius: 2,
                            }}
                        />
                        <ImageListItemBar
                            title={`Thumbnail ${index}`}
                            subtitle={
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        margin: 'auto',
                                    }}
                                >
                                    <span>{item.url}</span>
                                </Box>
                            }
                            position="below"
                            sx={{
                                backgroundColor: '#ffffff', // Fondo blanco para el texto
                                color: theme.palette.text.primary, // Usar color de texto primario del tema
                                borderTop: `1px solid black`, // Usar color primario del tema
                                width: '100%',
                                textAlign: 'center',
                            }}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
};

export default ImagesGallery;
