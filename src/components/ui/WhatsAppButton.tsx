import { siteConfig } from "@/config/site";
import { WhatsAppIcon } from "@/components/ui/SocialIcon";

export function WhatsAppButton() {
  return (
    <a
      href={siteConfig.contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Inquire about packages on WhatsApp (opens in a new tab)"
      title="Inquire about packages on WhatsApp"
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#25D366] text-[#052e16] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] motion-reduce:transition-none sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
