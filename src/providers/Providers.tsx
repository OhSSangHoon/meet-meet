"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from "react";
import AuthProvider from '@/providers/AuthProvider';
import Navbar from '@/components/shared/ui/Navbar';

/** 클라이언트 사이드 Providers
 * @param {React.ReactNode} children 자식 컴포넌트
 * @returns QueryClientProvider, ReactQueryDevtools, AuthProvider, Navbar, children
 */
export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 10,
                        gcTime: 1000 * 60 * 10,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Navbar />
                {children}
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
