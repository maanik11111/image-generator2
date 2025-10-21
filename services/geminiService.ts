
import { GoogleGenAI, Modality } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

export const combineImages = async (image1: File, image2: File): Promise<string> => {
    // This check is a safeguard. The API key should be provided by the environment.
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const [image1Base64, image2Base64] = await Promise.all([
            fileToBase64(image1),
            fileToBase64(image2)
        ]);
        
        const prompt = 'Using the two people from the provided images, create a new, single photorealistic image showing them together as a couple in a cute, romantic pose. Maintain their facial features and characteristics accurately. The background should be soft and slightly blurred.';

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: image1Base64,
                            mimeType: image1.type,
                        },
                    },
                    {
                        inlineData: {
                            data: image2Base64,
                            mimeType: image2.type,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        throw new Error("API did not return an image. The response may have been blocked.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate image. Please check the console for more details.");
    }
};
