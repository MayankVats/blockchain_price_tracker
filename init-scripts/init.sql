CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "chains" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "name" varchar(255) NOT NULL,
  "hexId" varchar(255) NOT NULL,
  "tokenId" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "prices" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "chainId" uuid NOT NULL REFERENCES chains(id),
  "price" DECIMAL NOT NULL,
  "recordedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "alerts" (
   "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
   "thresholdPrice" decimal NOT NULL,
   "email" character varying NOT NULL,
   "isActive" boolean NOT NULL DEFAULT true,
   "chainId" uuid NOT NULL REFERENCES chains(id)
);

INSERT INTO "chains" (name, "hexId", "tokenId") 
VALUES 
  ('Ethereum', '0x1', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
  ('Polygon', '0x89', '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270');