import LinkCard from "../passport/LinkCard";
import { Github, Twitter, Globe, Mail } from "lucide-react";

export default function LinkCardExample() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-md">
      <LinkCard icon={Github} title="GitHub" href="https://github.com" />
      <LinkCard icon={Twitter} title="Twitter" href="https://twitter.com" />
      <LinkCard icon={Globe} title="Website" href="https://example.com" />
      <LinkCard icon={Mail} title="Contact Me" href="mailto:hello@example.com" />
    </div>
  );
}
