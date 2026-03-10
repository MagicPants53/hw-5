import Link from "next/link";

import Text from "@/shared/components/Text";
import Button from "@/shared/components/Button";
import { paths } from "@/shared/config/paths";

export default function NotFound() {
  return (
    <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
      <Text view="title">Page not found</Text>
      <Text view="p-20" color="secondary">
      This page does not exist or has been deleted.
      </Text>
      <div style={{ marginTop: "2rem" }}>
        <Link href={paths.products}>
          <Button>Go to Products</Button>
        </Link>
      </div>
    </div>
  );
}

