/**
 * PromptBuilder
 * Generates the highly specific prompt required for photorealistic Saree Try-On using Gemini
 */

class PromptBuilder {
  /**
   * Constructs the final prompt strictly adhering to the prompt engineering requirements.
   * 
   * @param {String} userImageUrl - Reference to the user's photo
   * @param {String} sareeImageUrl - Reference to the saree photo
   * @returns {String} - The complete, optimized prompt
   */
  static buildTryOnPrompt(userImageUrl, sareeImageUrl) {
    return `A hyper-realistic, 8k resolution, professional fashion photograph of a beautiful Indian woman. She is wearing a gorgeous traditional Indian saree. The saree has intricate borders, highly detailed embroidery, rich colors, and physical silk folds perfectly draped around her waist and shoulder. Her face is perfectly photorealistic. Cinematic lighting, studio quality, highly detailed fabric texture, perfect anatomy.`;
  }
}

module.exports = PromptBuilder;
