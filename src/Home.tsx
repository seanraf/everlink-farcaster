import Pages from './view/Pages';

const token = getCookie('crossmint-jwt');
const isAuthenticated = !!token;

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
}

const Home = () => {
  return <Pages isAuthenticated={isAuthenticated} />;
};

export default Home;
