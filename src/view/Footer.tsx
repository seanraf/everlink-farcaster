import { Box } from '../components/Box';

const styles = {
  containerBox: {
    backgroundColor: '#1a1d21',
    justifyContent: 'center',
    display: 'flex',
    height: '80px',
  },
  contentBox: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  typography: {
    color: 'white',
  },
};

export default function Footer() {
  return (
    <Box style={styles.containerBox}>
      <Box style={styles.contentBox}>
        <Box style={styles.typography}>Presented by</Box>
        <a href='http://www.33d.co/' target='_blank' rel='noopener noreferrer'>
          <img src='/Digital.png' alt='33 Digital' width={70} height={21} />
        </a>
      </Box>
    </Box>
  );
}
