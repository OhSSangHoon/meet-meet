import Image from 'next/image';

export default function DetailThumbnailLoading() {
    return (
        <article className='max-w-screen-lg sm:w-[30rem] h-[14rem] bg-gray-50 rounded-lg animate-pulse'>
            <div className="relative px-3 bg-white/80 rounded-full flex items-center text-xs">
                <div className="absolute top-3 left-3 bg-main-600 rounded-full px-3 py-1 flex justify-center items-center gap-2 z-10">
                    <Image src={"/icons/Alarm.svg"} alt="시간" width={24} height={24} />
                    <span className="font-medium text-white">-후 마감</span>
                </div>
            </div>
        </article>
    );
}

