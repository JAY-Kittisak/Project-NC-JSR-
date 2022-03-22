import { BrowserRouter } from 'react-router-dom';

import Routes from "./routes/Routes";
import Layout from "./Layout";
import ModalContextProvider from './state/modal-context'
import AuthContextProvider from './state/auth-context'

function App() {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
          <BrowserRouter>
            <Layout>
              <Routes />
            </Layout>
          </BrowserRouter>
      </ModalContextProvider>
    </AuthContextProvider>
  );
}

export default App;
