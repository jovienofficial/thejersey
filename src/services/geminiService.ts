import { GoogleGenAI } from "@google/genai";

export const generateJerseyContent = async (image: string, mimeType: string, specs: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are the AI Content Engine for "The Jersey Guys", a premium football jersey business in India.
    Co-founders: Agastya Gala, Arhaan Ladakh, Yuvaan Khare, Shaurya Desai and Shivaan Desai.

    Analyze the provided football jersey image and user specifications: "${specs || 'No specific details provided'}".

    Return a structured JSON response with the following fields:
    1. detectedJersey: The name of the jersey (Team, Year, Edition).
    2. imagePrompt: A professional AI image generation prompt (for Ideogram) to create a cinematic lifestyle shot. IMPORTANT: Do NOT describe the jersey's colors, patterns, or specific team details (the user will provide the image as a reference). Focus ONLY on the environment, lighting, camera angles, and atmosphere. The prompt MUST NOT include any human models. The jersey should be displayed on a hanger, a flat lay, or a creative pedestal, but NEVER on a person.
    3. caption: A high-energy Instagram caption with football culture hype, appropriate for Indian fans.
    4. storyCaption: A short, punchy caption for Instagram Stories or Reels.
    5. postFormat: A suggestion for the best post format (e.g., Carousel, Reel, Static Shot).
    6. productListing: A professional product description for a website listing.
    7. tagSuggestions: A list of relevant accounts to tag (brands, players, influencers).
    8. hashtags: An array of 10-15 trending and relevant hashtags.
    9. contentIdeas: An array of 3 creative content ideas for this specific jersey.

    Tone: Premium, energetic, football-obsessed, "hype". Use Hinglish where appropriate if requested or if it fits the vibe.
    Output MUST be valid JSON.
  `;

  const result = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: image.split(',')[1],
              mimeType: mimeType
            }
          }
        ]
      }
    ]
  });

  const responseText = result.text;
  if (!responseText) {
    throw new Error("Empty response from AI");
  }

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  } else {
    throw new Error("Failed to parse AI response as JSON");
  }
};
