"use client";
import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex h-screen flex-col items-center justify-center gap-4">
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        <AlertDescription>{error.stack}</AlertDescription>
      </Alert>
      <Button variant="destructive" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
