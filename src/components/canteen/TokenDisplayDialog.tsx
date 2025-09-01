"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Token } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

type TokenDisplayDialogProps = {
  token: Token | null;
  onOpenChange: (isOpen: boolean) => void;
};

export default function TokenDisplayDialog({ token, onOpenChange }: TokenDisplayDialogProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token.id);
      toast({
        title: "Copied!",
        description: "Token ID has been copied to your clipboard.",
      });
    }
  };

  return (
    <Dialog open={!!token} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Token Generated Successfully</DialogTitle>
          <DialogDescription>
            Here is your unique token ID. Please show this at the counter.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <p className="text-sm font-mono p-3 bg-muted rounded-md break-all">
              {token?.id}
            </p>
          </div>
          <Button type="button" size="icon" className="px-3" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy Token ID</span>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
