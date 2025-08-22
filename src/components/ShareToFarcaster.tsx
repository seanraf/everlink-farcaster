import { sdk } from '@farcaster/frame-sdk';

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
    <button
      className="w-fit text-[#855DCD] gap-2 mx-auto border-2 bg-white border-[#855DCD] rounded-lg px-4 py-2 mt-2 font-bold cursor-pointer flex items-center justify-center"
      onClick={shareToWarpcast}
      type="button"
    >
      <img
        src={'/FarcasterPurpleLogo.svg'}
        alt='Icon'
        width={25.86}
        height={24}
      />
      Share To Farcaster Frame
    </button>
  );
}
