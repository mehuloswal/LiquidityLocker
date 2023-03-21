import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { createStandaloneToast } from '@chakra-ui/toast';
import { publicProvider } from 'wagmi/providers/public';
import { localhost } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import theme from './utils/theme';

const { chains, provider, webSocketProvider } = configureChains(
  [localhost],
  [publicProvider()]
);
const { ToastContainer, toast } = createStandaloneToast();
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: 'wagmi',
    //   },
    // }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: true,
    //   },
    // }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId: '...',
    //   },
    // }),
  ],
  provider,
  webSocketProvider,
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <React.StrictMode>
      <ChakraProvider>
        <WagmiConfig client={client}>
          <App />
          <ToastContainer />
        </WagmiConfig>
      </ChakraProvider>
    </React.StrictMode>
  </>
);

toast({ title: 'Chakra UI' });
