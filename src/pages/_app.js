import '@/styles/globals.css'
import Drawer from '../components/drawer/Drawer';

export default function App({ Component, pageProps }) {
  return (
    <Drawer>
      <Component {...pageProps} />
    </Drawer>
  );
  
}

