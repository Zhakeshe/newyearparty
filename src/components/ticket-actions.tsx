"use client";

import { Download, Link as LinkIcon, Share2 } from "lucide-react";

interface TicketActionsProps {
  linkUrl: string;
  qrDataUrl: string;
  ticketNumber: string;
}

export function TicketActions({ linkUrl, qrDataUrl, ticketNumber }: TicketActionsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "JOO Ticket", url: linkUrl });
        return;
      } catch (error) {
        console.error("Share failed", error);
      }
    }

    await navigator.clipboard.writeText(linkUrl);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(linkUrl);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button
        className="flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-3 hover:shadow-glow"
        onClick={handleShare}
        type="button"
      >
        <Share2 size={16} /> Share
      </button>
      <button
        className="flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/10 py-3"
        onClick={handleCopy}
        type="button"
      >
        <LinkIcon size={16} /> Copy link
      </button>
      <a
        className="flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/10 py-3"
        href={qrDataUrl}
        download={`ticket-${ticketNumber}.png`}
      >
        <Download size={16} /> Download QR
      </a>
    </div>
  );
}
