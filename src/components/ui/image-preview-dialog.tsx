import React, { useRef } from 'react';
import { DownloadIcon, PictureInPicture, Shrink } from 'lucide-react';
import { Label } from './label';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from './drawer';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface PreviewDialogProps {
  className?: string;
  open: boolean;
  alt?: string;
  preview: string | ArrayBuffer | null;
  onClose: () => void;
}
interface ZoomProps {
  x: number;
  y: number;
  scale: number;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  className,
  open,
  alt,
  preview,
  onClose
}) => {
  const isDesktop = useMediaQuery('(min-width: 1500px)');
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const onUpdate = React.useCallback(({ x, y, scale }: ZoomProps) => {
    const { current: img } = imgRef;

    if (img) {
      const value = make3dTransformValue({ x, y, scale });
      img.style.setProperty('transform', value);
    }
  }, []);

  const shrink = () => {
    const { current: img } = imgRef;
    if (img) {
      img.style.removeProperty('transform');
    }
  };

  const handleDownload = () => {
    if (typeof preview === 'string') {
      const link = document.createElement('a');
      link.href = preview;
      link.download = alt || 'image.png';
      link.click();
    }
  };

  const handleClose = () => {
    shrink();
    onClose();
  };

  const title = (
    <>
      <PictureInPicture />
      <Label className="font-semibold">{alt}</Label>
    </>
  );

  const content = (
    <>
      <QuickPinchZoom onUpdate={onUpdate} containerProps={{ className: 'border' }} centerContained>
        <div ref={containerRef} className="relative">
          <Image
            ref={imgRef}
            src={preview as string}
            alt={alt || ''}
            width={'600'}
            height={'600'}
            className="transform-origin-center"
          />
        </div>
      </QuickPinchZoom>

      <div className="flex gap-5 justify-end my-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Shrink className="cursor-pointer" onClick={shrink} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Shrink</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DownloadIcon className="cursor-pointer" onClick={handleDownload} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className={cn('max-h-[50vw] ', className)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent className={cn('overflow-hidden', className)}>
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">{title}</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        {content}
        <Label className="italic mb-2">{alt}</Label>
      </DrawerContent>
    </Drawer>
  );
};
