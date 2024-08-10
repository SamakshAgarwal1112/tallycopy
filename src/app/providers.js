"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/color-mode";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export function Providers({ children }) {
  return <ChakraProvider theme={theme}> <ColorModeScript initialColorMode={theme.config.initialColorMode} />{children}</ChakraProvider>;
}
