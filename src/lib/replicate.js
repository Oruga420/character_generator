import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Genera una imagen usando nano-banana-pro
 */
export async function generateImagePro(prompt, aspectRatio = "4:3") {
  try {
    const output = await replicate.run("google/nano-banana-pro", {
      input: {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        output_format: "png",
        resolution: "2K",
        safety_filter_level: "block_only_high",
      },
    });

    return output;
  } catch (error) {
    console.error("Error generating image with nano-banana-pro:", error);
    throw error;
  }
}

/**
 * Genera una imagen usando nano-banana regular
 */
export async function generateImageRegular(prompt, aspectRatio = "4:3") {
  try {
    const output = await replicate.run("google/nano-banana", {
      input: {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        output_format: "png",
        resolution: "1K",
        safety_filter_level: "block_only_high",
      },
    });

    return output;
  } catch (error) {
    console.error("Error generating image with nano-banana:", error);
    throw error;
  }
}

/**
 * Genera 4 variaciones de una imagen usando el mismo prompt
 */
export async function generateFourVariations(prompt, usePro = true) {
  const generateFunc = usePro ? generateImagePro : generateImageRegular;

  try {
    const promises = [
      generateFunc(prompt, "4:3"),
      generateFunc(prompt, "3:4"),
      generateFunc(prompt, "16:9"),
      generateFunc(prompt, "1:1"),
    ];

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error generating four variations:", error);
    throw error;
  }
}
