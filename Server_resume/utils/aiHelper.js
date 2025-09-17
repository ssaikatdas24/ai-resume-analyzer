
// const { pipeline, cos_sim } = await import('@xenova/transformers');
import { pipeline, cos_sim } from '@xenova/transformers'; // <--- CHANGE

// Use a singleton pattern to ensure we only load models once.
class PipelineSingleton {
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      this.instance = {
        embedder: await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2'),
        rewriter: await pipeline('text2text-generation', 'Xenova/flan-t5-small'),
      };
    }
    return this.instance;
  }
}

const calculateSimilarity = async (text1, text2) => {
  const { embedder } = await PipelineSingleton.getInstance();
  
  const embedding1 = await embedder(text1, { pooling: 'mean', normalize: true });
  const embedding2 = await embedder(text2, { pooling: 'mean', normalize: true });
  
  // cos_sim returns a value between -1 and 1. We map it to a 0-100 scale.
  const similarity = cos_sim(embedding1.data, embedding2.data);
  const score = Math.round((similarity + 1) * 50);
  return score;
};

const rewriteBulletPoint = async (bullet) => {
  const { rewriter } = await PipelineSingleton.getInstance();
  const prompt = `Rewrite the following resume bullet point to be more concise and achievement-focused. Bullet: "${bullet}"`;
  const result = await rewriter(prompt, {
    max_new_tokens: 50,
    temperature: 0.7,
    repetition_penalty: 1.5,
  });
  return result[0].generated_text.trim();
};

// module.exports = { calculateSimilarity, rewriteBulletPoint };
export { calculateSimilarity, rewriteBulletPoint };