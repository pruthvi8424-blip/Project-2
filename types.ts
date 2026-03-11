
export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  timestamp: string;
  verifiedCount: number;
}

export interface VerificationResult {
  status: 'authentic' | 'counterfeit' | 'reused';
  product?: Product;
  message: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export enum AppMode {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SEARCH = 'SEARCH'
}
