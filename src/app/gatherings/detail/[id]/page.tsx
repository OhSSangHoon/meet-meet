import { PageProps } from '@/types/pageprops';
import GatheringsDetailPageUI from './ui';

export default function GatheringsDetailPage({ params }: PageProps) {
    return <GatheringsDetailPageUI params={params} />
}