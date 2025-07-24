import { Button } from '@mui/material';
import { sdk } from '@farcaster/frame-sdk';

const styles = {
  shareToFarcaster: {
    width: 'fit-content',
    color: 'primary.main',
    gap: '8px',
    mx: 'auto',
    border: '2px solid #855DCD',
    borderRadius: '8px',
    padding: '8px 16px',
    fontWeight: 'bold',
  },
};

export default function ShareToFarcaster({ customURL }: { customURL: string }) {
  const shareToWarpcast = async () => {
    try {
      const result = await sdk.actions.composeCast({
        text: customURL,
        embeds: ['https://i.ibb.co/B2V7ddyb/1200-628.png'],
      });

      console.log('Cast composed successfully:', result?.cast?.hash);
    } catch (error) {
      console.error('Failed to compose cast:', error);
      window.open(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(customURL)}&embeds[]=${encodeURIComponent('https://i.ibb.co/B2V7ddyb/1200-628.png')}`,
        '_blank'
      );
    }
  };

  return (
    <Button
      variant='outlined'
      sx={styles.shareToFarcaster}
      onClick={shareToWarpcast}
    >
      <img
        src={'/FarcasterPurpleLogo.svg'}
        alt='Icon'
        width={25.86}
        height={24}
      />
      Share To Farcaster Frame
    </Button>
  );
}
