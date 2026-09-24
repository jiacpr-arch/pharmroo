import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LiffLinkContent from "./LiffLinkContent";

export default function LiffLinkPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
        </div>
      }
    >
      <LiffLinkContent />
    </Suspense>
  );
}
