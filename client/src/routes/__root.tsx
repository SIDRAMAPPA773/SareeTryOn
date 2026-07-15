import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../views/styles.css?url";
import { reportLovableError } from "../controllers/lib/lovable-error-reporting";
import { Footer } from "@/views/components/footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Virtual Couture — AI Saree Try-On Studio" },
      { name: "description", content: "An AI-powered saree virtual try-on boutique. Drape hand-picked silks, cottons and georgettes over your own photo in seconds." },
      { name: "author", content: "Virtual Couture" },
      { property: "og:title", content: "Virtual Couture — AI Saree Try-On Studio" },
      { property: "og:description", content: "An AI-powered saree virtual try-on boutique. Drape hand-picked silks, cottons and georgettes over your own photo in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Virtual Couture — AI Saree Try-On Studio" },
      { name: "twitter:description", content: "An AI-powered saree virtual try-on boutique. Drape hand-picked silks, cottons and georgettes over your own photo in seconds." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/42212a63-6604-4187-bd2e-70ce71548e0e/id-preview-4f843c85--fde4afb9-0d9e-4e07-b548-0eb192ec97aa.lovable.app-1783333690290.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/42212a63-6604-4187-bd2e-70ce71548e0e/id-preview-4f843c85--fde4afb9-0d9e-4e07-b548-0eb192ec97aa.lovable.app-1783333690290.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Toaster } from 'sonner';

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    let timeoutId: number | NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      // 2 minutes = 120,000 ms
      timeoutId = setTimeout(() => {
        // Redirect to welcome/home page
        router.navigate({ to: "/" });
      }, 120000);
    };

    // Events that reset the inactivity timer
    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];

    let lastActivityTime = Date.now();
    const handleUserActivity = () => {
      const now = Date.now();
      // Only reset timeout at most once every second to prevent scroll jank
      if (now - lastActivityTime > 1000) {
        lastActivityTime = now;
        resetTimeout();
      }
    };

    // Attach event listeners
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Initialize timer
    resetTimeout();

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-background" />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" richColors />
      <Footer />
    </QueryClientProvider>
  );
}
