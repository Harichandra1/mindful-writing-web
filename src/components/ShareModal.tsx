
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Share, Copy, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ShareModalProps {
  documentId: string;
  documentTitle: string;
}

export default function ShareModal({ documentId, documentTitle }: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/?documentId=${documentId}`;
  
  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied to clipboard" });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="flex gap-1">
        <Share size={16} />
        <span>Share</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Anyone with this link can view "{documentTitle}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Input 
                readOnly 
                value={shareUrl}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyLink}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
