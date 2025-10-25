"use client";
import React from 'react'
import { AdminUserInfo } from '@/components/user-info'
// import data from "@/app/admin/data.json";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { getAllUsers } from '@/app/(user)/profile/api';
import { useQuery } from '@tanstack/react-query';



export default function page() {


    // Fetch current logged-in user
    const { data, isLoading, isError } = useQuery({
      queryKey: ["currentUser"],
      queryFn: () => getAllUsers(),
    });
  
    console.log("data",data);
    
  
    if (isLoading) {
      return (
        <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
              </div>
       <div className="text-center mt-20 text-gray-400">Loading user profile...</div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
      )
    }
  
    if (isError) {
      return (
        <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
              </div>
       <div className="text-center mt-20 text-gray-400">Error loading user profile.</div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
      )
    }
  
  

  return (
  <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
              </div>
              <AdminUserInfo data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

