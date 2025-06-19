"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from '@/providers/ThemeProvider';
import { useState } from "react";
import dynamic from 'next/dynamic';
import AuthProvider from '@/providers/AuthProvider';
import Navbar from '@/components/shared/Navbar';

const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), {
    ssr: false,
});


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
            <ThemeProvider>
                <AuthProvider>
                    <Navbar />
                    {children}
                </AuthProvider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
