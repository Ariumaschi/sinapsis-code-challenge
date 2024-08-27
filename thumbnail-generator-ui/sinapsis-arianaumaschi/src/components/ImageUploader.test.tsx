import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageUploader from './ImageUploader';
import { uploadImage } from '../services/thumbnailService';




jest.mock('../services/thumbnailService', () => ({
    uploadImage: jest.fn(),
  }));

describe('ImageUploader Component', () => {
    test('renders ImageUploader component', () => {
        render(<ImageUploader />);
        // Verificar si el texto "Seleccionar archivo" está en el documento
        expect(screen.getByText(/Seleccionar archivo/i)).toBeInTheDocument();
    });
}); 

