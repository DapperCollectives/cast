/* eslint-disable */
import 'react-datepicker/dist/react-datepicker.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ErrorBoundary } from 'react-error-boundary';
import { HashRouter as Router } from 'react-router-dom';
import NotificationModalProvider from 'contexts/NotificationModal';
import NotificationServiceProvider from 'contexts/NotificationService';
import { Web3Provider } from 'contexts/Web3';
import { ErrorHandler } from 'components';
import { IS_PRODUCTION } from 'const';
import { ChakraProvider } from '@chakra-ui/react';
import Hotjar from '@hotjar/browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import theme from 'helpers/theme';
import AppPages from 'pages';
import Error from 'pages/Error';
import './App.sass';

const hotjarVersion = 6;
Hotjar.init(process.env.REACT_APP_HOTJAR_SITE_ID, hotjarVersion);

// create react-query client
const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Error error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onReset={() => (window.location.href = '/')}
    >
      <QueryClientProvider client={queryClient}>
        <Web3Provider network={process.env.REACT_APP_FLOW_ENV}>
          <Router>
            {/* using resetCSS to avoid conficts */}
            <ChakraProvider theme={theme} resetCSS={false}>
              <NotificationServiceProvider>
                <NotificationModalProvider>
                  <ErrorHandler>
                    <AppPages />
                  </ErrorHandler>
                </NotificationModalProvider>
              </NotificationServiceProvider>
            </ChakraProvider>
          </Router>
        </Web3Provider>
        {!IS_PRODUCTION && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
