export interface ServerFetcherOptions extends RequestInit {
    next?: {
        revalidate?: number;
    };
}

/**
 * Server Side API Fetcher
 * @param url 
 * @param options 
 * @returns Response JSON
 */
export async function serverFetcher<T = unknown>(
    url: string,
    options?: ServerFetcherOptions,
): Promise<T> {
    const defaultHeaders = { 'Content-Type': 'application/json' };

    const mergedOptions: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options?.headers || {}),
        },
        cache: options?.cache || 'no-store',
    };

    const fullUrl = `${process.env.API_URI_DEV}${url}`;

    const response = await fetch(fullUrl, mergedOptions);

    if (!response.ok) {
        // 서버사이드라면 에러를 throw해서 상위에서 핸들링하도록
        const errorText = await response.text();
        throw new Error(`serverFetcher: ${response.status} ${response.statusText} - ${errorText}`);
    }

    try {
        return await response.json();
    } catch (error) {
        console.error('serverFetcher: ', error);
        return (await response.text()) as T;
    }
}
