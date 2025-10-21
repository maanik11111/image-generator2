
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // The result is in the format "data:image/png;base64,THE_BASE64_STRING"
        // We need to extract just the base64 part.
        const base64String = reader.result.split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Failed to extract base64 string from file.'));
        }
      } else {
        reject(new Error('File could not be read as a string.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
