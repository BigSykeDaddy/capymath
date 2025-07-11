// pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import { Nav } from "@/components/Nav";
import "@/styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: React.ComponentType<any>;
  pageProps: { session?: any; [key: string]: any };
}) {
  return (
    <SessionProvider session={session}>
      <Nav />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
