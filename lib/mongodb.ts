import { Db, MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  );
}

interface MongoClientAndDb {
  client: MongoClient;
  db: Db;
}

const getClient = (): Promise<MongoClientAndDb> =>
  MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((client) => ({
    client,
    db: client.db(MONGODB_DB),
  }));

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export default async function connectToDatabase(): Promise<MongoClientAndDb> {
  if (process.env.NODE_ENV === 'development') {
    if (!!cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = getClient();
    }
    console.log('CONNECTING TO DB...');
    cached.conn = await cached.promise;
    console.log('SUCCESSFULLY CONNECTED TO DB...');
    return cached.conn;
  } else {
    // don't use global variable in production
    return getClient();
  }
}
