import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface ContentSectionProps {
  className?: string;
  title: string;
  desc: string;
  children: JSX.Element;
}

export default function ContentSection({ className, title, desc, children }: ContentSectionProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex-none">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Separator className="my-4 flex-none" />
      <div className="faded-bottom -mx-4 flex-1 overflow-auto scroll-smooth px-4 md:pb-10">
        {children}
      </div>
    </div>
  );
}
