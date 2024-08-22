import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageUploader from './ImageUploader';


describe('ImageUploader Component', () => {
    beforeEach(() => {
        // Mock URL.createObjectURL
        global.URL.createObjectURL = jest.fn(() => 'http://mockurl.com/mockimage.jpg');
    });

    test('renders ImageUploader component', () => {
        render(<ImageUploader />);
        expect(screen.getByText(/Seleccionar archivo/i)).toBeInTheDocument();
        expect(screen.getByText(/Imágenes subidas:/i)).toBeInTheDocument();
    });

    test('shows preview image after file is selected', async () => {
        render(<ImageUploader />);
        const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
        const input = screen.getByLabelText(/Seleccionar archivo/i) as HTMLInputElement;

        // Simula el cambio en el input
        fireEvent.change(input, { target: { files: [file] } });

        // Usa findByAltText en lugar de waitFor + getByAltText
        const previewImage = await screen.findByAltText(/Vista previa/i);
        expect(previewImage).toBeInTheDocument();
    });
    


test('uploads image and shows thumbnail', async () => {
    render(<ImageUploader />);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/Seleccionar archivo/i) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/Subir Imagen/i));

    // Verifica que el loader está en el DOM
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Usa findByAltText para esperar el thumbnail
    const thumbnailImage = await screen.findByAltText(/Thumbnail 0/i);
    expect(thumbnailImage).toBeInTheDocument();
  });

});
