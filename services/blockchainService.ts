
import { Product, VerificationResult } from '../types';

const STORAGE_KEY = 'chaintrust_ledger';

export const registerProduct = async (id: string, name: string, manufacturer: string): Promise<Product> => {
  const ledger = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  
  if (ledger[id]) {
    throw new Error('Product ID already exists on the ledger.');
  }

  const newProduct: Product = {
    id,
    name,
    manufacturer,
    timestamp: new Date().toISOString(),
    verifiedCount: 0,
  };

  ledger[id] = newProduct;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return newProduct;
};

export const verifyProduct = async (id: string): Promise<VerificationResult> => {
  const ledger = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const product = ledger[id] as Product | undefined;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!product) {
    return {
      status: 'counterfeit',
      message: 'This product ID was not found in our secure registry. Warning: Potential counterfeit detected.'
    };
  }

  if (product.verifiedCount > 0) {
    product.verifiedCount += 1;
    ledger[id] = product;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
    
    return {
      status: 'reused',
      product,
      message: `Warning: This QR code has been verified ${product.verifiedCount} times. Authentic QR codes should only be scanned once.`
    };
  }

  product.verifiedCount = 1;
  ledger[id] = product;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));

  return {
    status: 'authentic',
    product,
    message: 'Success! This product is authentic and has been verified for the first time.'
  };
};

export const getAllProducts = (): Product[] => {
  const ledger = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return Object.values(ledger);
};
