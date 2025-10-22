import Arweave from 'arweave';

const WALLET_KEYS = import.meta.env.VITE_AR_WALLET_KEYS;

export const uploadToArweave = async (blob: Blob) => {
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });

    const fileData = await blob.arrayBuffer();

    const transaction = await arweave.createTransaction({ data: fileData });
    transaction.addTag('Content-Type', 'text/html');

    const walletKey = JSON.parse(WALLET_KEYS);
    await arweave.transactions.sign(transaction, walletKey);
    const response = await arweave.transactions.post(transaction);
    if (response.status === 200) {
      console.log('✅ Uploaded to Arweave:', transaction.id);
      return { success: true, transactionId: transaction.id };
    } else {
      throw new Error(`Upload failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error uploading to Arweave:', error);
    return { success: false, error };
  }
};
