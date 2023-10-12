import { env } from "env";

export default function Page(): JSX.Element {
  return <>{env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}</>;
}
