'use client';
import { BasePayButton } from '@base-org/account-ui/react';
import { pay } from '@base-org/account';

export function BasePay() {
  const handlePayment = async (): Promise<void> => {
    try {
      const payment = await pay({
        amount: '20.00',
        to: '0xEDA1896bDf3908c2e480492ecfF0491a50D380eD',
        testnet: true,
      });
      // Option 1: Poll until mined
      // const { status } = await getPaymentStatus({
      //   id: payment.id,
      //   testnet: true, // MUST match the testnet setting used in pay()
      // });
      // if (status === 'completed') console.log('🎉 payment settled');
      console.log(`Payment sent! Transaction ID: ${payment}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Payment failed: ${err.message}`);
      } else {
        console.error('Payment failed:', err);
      }
    }
  };

  return <BasePayButton colorScheme='dark' onClick={handlePayment} />;
}
