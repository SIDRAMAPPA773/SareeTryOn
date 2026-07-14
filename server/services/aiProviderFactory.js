const segmindProvider = require('./providers/segmind');
const falProvider = require('./providers/fal');
const replicateProvider = require('./providers/replicate');
const youcamProvider = require('./providers/youcam');

/**
 * AI Provider Factory to dynamically load the correct Virtual Try-On provider.
 */
class AIProviderFactory {
  constructor() {
    this.providers = {
      segmind: segmindProvider,
      fal: falProvider,
      replicate: replicateProvider,
      youcam: youcamProvider
    };
  }

  /**
   * Main entry point to generate Try-On image via the configured provider.
   * @param {string} userImageUrl - Cloudinary URL of the user portrait
   * @param {string} sareeImageUrl - Cloudinary URL of the saree garment
   * @returns {Promise<{ generatedImageUrl: string, modelUsed: string, generationTimeSeconds: string }>}
   */
  async generate(userImageUrl, sareeImageUrl) {
    const providerKey = (process.env.AI_PROVIDER || 'segmind').toLowerCase();
    
    const selectedProvider = this.providers[providerKey];
    if (!selectedProvider) {
      throw new Error(`Invalid AI_PROVIDER specified in .env: ${providerKey}`);
    }

    console.log(`\n[AI FACTORY] Routing request to provider: ${providerKey.toUpperCase()}`);
    return await selectedProvider.generateTryOn(userImageUrl, sareeImageUrl);
  }
}

module.exports = new AIProviderFactory();
