import embedding from '../../../config/embedding';
import qdrantClient from '../../../config/quadrant';
import { randomUUID } from 'crypto';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';

export const COLLECTION_NAME = 'general_qa';

export const addKnowladgeServices = async (
  content: string,
  title: string,
  description: string,
) => {
  const collections = await qdrantClient.getCollections();

  const exists = collections.collections.some(
    (collection) => collection.name === COLLECTION_NAME,
  );

  if (!exists) {
    await qdrantClient.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 1024,
        distance: 'Cosine',
      },
    });
  }
  const vector = await embedding(content);

  if (!Array.isArray(vector) || typeof vector[0] !== 'number') {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Formate mismatch!');
  }

  const result = await qdrantClient.upsert('general_qa', {
    wait: true,
    points: [
      {
        id: randomUUID(),
        vector: vector as number[],
        payload: {
          title,
          description,
          content
        },
      },
    ],
  });

  if (result.status !== 'completed') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Knowledge not inserted!');
  }

  return result;
};