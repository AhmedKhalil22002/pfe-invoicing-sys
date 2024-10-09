import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { DownloadIcon, ImagePlus, PictureInPicture, Shrink, ZoomIn, ZoomOut } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from './button';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from './drawer';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { PreviewDialog } from './image-preview-dialog';

interface ImageUploaderProps {
  className?: string;
  value?: File;
  onChange?: (value?: File) => void;
  width?: `${number}`;
  height?: `${number}`;
  alt?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  className,
  value,
  onChange,
  width,
  height,
  alt
}) => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>();
  const { value: debouncedPreview, loading: previewing } = useDebounce<
    string | ArrayBuffer | null | undefined
  >(preview, 500);

  const [viewDialog, setViewDialog] = React.useState(false);

  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    if (value) {
      createPreview(value);
    }
  }, [value]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        createPreview(file);
        onChange?.(file);
      } else {
        onChange?.(undefined);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1000000,
    accept: { 'image/png': [] }
  });

  return (
    <div className="flex flex-col mb-5">
      <PreviewDialog
        open={viewDialog}
        alt={alt}
        preview={debouncedPreview || ''}
        onClose={() => setViewDialog(false)}
      />
      <div
        {...getRootProps()}
        className={cn(
          className,
          'flex flex-col items-center justify-center rounded-lg p-2 shadow-sm shadow-foreground w-full cursor-pointer '
        )}>
        <Label className="italic mb-2">{alt}</Label>

        {debouncedPreview ? (
          <div className="flex flex-col gap-4 items-center w-28 h-28">
            <Image
              src={debouncedPreview as string}
              alt={alt || ''}
              className="rounded-lg my-auto"
              width={width || '112'}
              height={height || '112'}
            />
            <Label className="text-center">
              {isDragActive ? 'Drop the image' : 'Click to Select'}
            </Label>
          </div>
        ) : (
          !debouncedPreview && <ImagePlus className="size-28" />
        )}
        <Input {...getInputProps()} type="file" />
      </div>
      <div className="flex mt-2 justify-center" style={{ height: '40px' }}>
        <div className="flex gap-2">
          <Button
            disabled={!preview}
            onClick={() => {
              setViewDialog(true);
            }}>
            View
          </Button>
          <Button
            disabled={!preview}
            variant={'secondary'}
            onClick={() => {
              onDrop([]);
              setPreview(null);
            }}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
