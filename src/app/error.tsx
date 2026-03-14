"use client";

import Link from "next/link";

import { paths } from "@/shared/config/paths";
import Button from "@/shared/components/Button";
import Text from "@/shared/components/Text";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {

  return (
    <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
      <Text view="title">Something went wrong</Text>
      <Text view="p-20" color="secondary">
      We already know about the problem. Try refreshing the page or returning to the main page.
      </Text>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Button onClick={reset}>Try again</Button>
        <Link href={paths.products}>
          <Button view="ghost">Go to Products</Button>
        </Link>
      </div>
    </div>
  );
}

