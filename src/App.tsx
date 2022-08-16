import { BrowserRouter } from 'react-router-dom';

import Routes from "./routes/Routes";
import Layout from "./Layout";
import ModalContextProvider from './state/modal-context'
import AuthContextProvider from './state/auth-context'
import AlertContextProvider from './state/alert-context'

function App() {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <AlertContextProvider>
          <BrowserRouter>
            <Layout>
              <Routes />
            </Layout>
          </BrowserRouter>
        </AlertContextProvider>
      </ModalContextProvider>
    </AuthContextProvider>
  );
}

export default App;
