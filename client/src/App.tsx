import { Helmet } from "react-helmet";
import { Provider as JotaiProvider } from "jotai";
import { MantineProvider } from "@mantine/core";
import theme from "./theme";
import AppRoutes from "./routes";
import './polyfills.ts';

function App() {
  return (
    <>
      <Helmet>
        <title>Iot Chat Prototype</title>
      </Helmet>
      <JotaiProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <AppRoutes />
        </MantineProvider>
      </JotaiProvider>
    </>
  );
}

export default App;
