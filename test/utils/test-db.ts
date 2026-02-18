import { MongoMemoryReplSet } from 'mongodb-memory-server';

export const createInMemoryMongo = async () => {
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });
  const uri = replSet.getUri();

  return {
    uri,
    stop: async () => {
      await replSet.stop();
    },
  };
};
