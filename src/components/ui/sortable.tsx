import React, { FC, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Item {
  id: number;
}

interface SortableLinkCardProps {
  id: Item;
  onDelete: (id: number) => void;
  children?: ReactNode;
}

const SortableLinks: FC<SortableLinkCardProps> = ({ id, onDelete, children }) => {
  const uniqueId = id.id;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: uniqueId,
    resizeObserverConfig: { disabled: true }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const handleButtonClick = () => {
    onDelete(uniqueId);
  };

  const isCursorGrabbing = attributes['aria-pressed'];

  return (
    <div ref={setNodeRef} style={style} key={uniqueId}>
      <Card className="p-3 relative flex justify-between gap-2 group ">
        <div className="w-full">{children}</div>
        <div className="flex flex-col items-center">
          <button className="mb-auto" onClick={handleButtonClick}>
            <X className="hover:text-red-400 h-5 w-5" />
          </button>
          <button
            {...attributes}
            {...listeners}
            className={cn('mt-auto', ` ${isCursorGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`)}
            aria-describedby={`DndContext-${uniqueId}`}>
            <Grip className="h-5 w-5" />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SortableLinks;
