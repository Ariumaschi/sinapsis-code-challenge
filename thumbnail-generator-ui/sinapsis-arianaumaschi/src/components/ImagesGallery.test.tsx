// src/ImagesGallery.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImagesGallery from './ImagesGallery';
import { ThemeProvider, createTheme } from '@mui/material/styles';

describe('ImagesGallery Component', () => {
    // Crear un tema de MUI para envolver el componente en el test
    const theme = createTheme();

    const mockThumbnailUrls = [
        {
            url: 'http://example.com/image1.jpg',
            image: 'http://example.com/image1.jpg',
        },
        {
            url: 'http://example.com/image2.jpg',
            image: 'http://example.com/image2.jpg',
        },
    ];

    test('renders ImagesGallery component and displays images and URLs', () => {
        render(
            <ThemeProvider theme={theme}>
                <ImagesGallery thumbnailUrls={mockThumbnailUrls} />
            </ThemeProvider>
        );

        // Verifica que el título está presente
        expect(screen.getByText(/Imágenes Subidas/i)).toBeInTheDocument();

        // Verifica que las imágenes están presentes
        mockThumbnailUrls.forEach((item) => {
            expect(screen.getByAltText(`Thumbnail ${mockThumbnailUrls.indexOf(item)}`)).toBeInTheDocument();
            expect(screen.getByText(item.url)).toBeInTheDocument();
        });
    });
});
