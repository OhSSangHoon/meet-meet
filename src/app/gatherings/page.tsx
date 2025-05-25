import Gatherings from "@/components/gatherings/gatherings";
import { Gathering } from "@/types/gatherings";

async function getInitialGatherings(): Promise<Gathering[]> {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/api/gatherings?limit=10&offset=0`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('SSR API 실패:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            return [];
        }

        const data = await response.json();

        // console.log(data);

        if (Array.isArray(data)) {
            // console.log('SSR 데이터:', data.length, '개');
            return data;
        } else {
            console.warn('응답이 배열이 아닙니다:', data);
            return [];
        }

    } catch (error) {
        console.error('SSR 에러:', error);

        return [];
    }
}

export default async function GatheringsPage() {
    const initialGatherings = await getInitialGatherings();

    return (
        <div className="contents-container">
            <Gatherings initialGatherings={initialGatherings} />
        </div>
    );
}