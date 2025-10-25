"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"



import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronDown } from "lucide-react"
import { useState } from "react"



export function NavMain() {
  const [open, setOpen] = useState(false)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between w-full text-sm font-medium hover:bg-gray-800 rounded-lg px-3 py-2 transition"
            >
              <span className="flex items-center gap-2">
                👤 User
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </SidebarMenuButton>
            {open && (
              <SidebarMenuSub className="mt-1 pl-6 space-y-1">
                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/admin/user-info"
                      className="block py-2 px-2 rounded-md hover:bg-gray-800 text-sm transition"
                    >
                      👤 User Info
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/admin/posts"
                      className="block py-2 px-2 rounded-md hover:bg-gray-800 text-sm transition"
                    >
                      📝 Posts
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
