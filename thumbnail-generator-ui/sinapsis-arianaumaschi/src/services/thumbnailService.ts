export const uploadImageAndGetThumbnails = async (file: File): Promise<string[]> => {
    const formData = new FormData();
    formData.append('image', file);
  
    // Simulación de una llamada API usando fetch.
    const response = await fetch('https://api.mock/thumbnail-generator', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Error uploading image');
    }
  
    // Suponiendo que la respuesta de la API nos devuelve una lista de URLs de miniaturas.
    const data = await response.json();
    return data.thumbnails;
  };
  