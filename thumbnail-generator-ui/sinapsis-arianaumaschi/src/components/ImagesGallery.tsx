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
                    backgroundColor: 'transparent',
                }}
                cols={isMobile ? 1 : (isTablet ? 2 : 3)}
            >
                {thumbnailUrls.map((item, index) => (
                    <ImageListItem
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            border: `4px solid black`, 
                            borderRadius: 2,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  
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
                                backgroundColor: '#ffffff',  
                                color: theme.palette.text.primary,  
                                borderTop: `1px solid black`,  
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
