import { QdrantClient } from "@qdrant/js-client-rest";
import config from ".";

const qdrantClient = new QdrantClient({
  url: config.QDRANT_ENDPOINT!,
  apiKey: config.QDRANT_API_KEY!,
});

export default qdrantClient;