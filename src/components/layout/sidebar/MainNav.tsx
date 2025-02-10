import { ChevronRight, type LucideIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/router';
import { useSidebarHistoryManager } from '../useSidebarHistoryManager';

export function MainNav({
  items
}: {
  items: {
    id: number;
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const router = useRouter();
  const { activeCollapsibles, addActiveCollapsible, removeActiveCollapsible, setLastClickedItem } =
    useSidebarHistoryManager();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isOpen = activeCollapsibles.includes(item.id);

          return (
            <Collapsible
              key={item.id}
              asChild
              defaultOpen={isOpen}
              className="group/collapsible"
              onOpenChange={(open) =>
                open ? addActiveCollapsible(item.id) : removeActiveCollapsible(item.id)
              }>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items && item.items.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem
                          key={subItem.title}
                          className=" hover:bg-zinc-700 rounded-md">
                          <SidebarMenuSubButton asChild>
                            <Label
                              className="cursor-pointer"
                              onClick={() => {
                                setLastClickedItem(subItem.title);
                                router.push(subItem.url);
                              }}>
                              {subItem.icon && <subItem.icon className="mr-2" />}
                              <span>{subItem.title}</span>
                            </Label>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
