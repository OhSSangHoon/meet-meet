'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
    src: string;
    fallbackSrc: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
}

export default function ImageWithFallback(props: ImageWithFallbackProps) {
    const { src, fallbackSrc, alt, width, height, className, priority = false, ...rest } = props;

    const [imgSrc, setImgSrc] = useState(src);

    return (
        <>
            <Image
                {...rest}
                src={imgSrc}
                alt={alt}
                onError={() => {
                    console.log('이미지 로드 실패 => fallback 이미지 적용');
                    setImgSrc(fallbackSrc)
                }}
                width={width}
                height={height}
                className={className}
                sizes="200px"
                priority={priority}
                fetchPriority={priority ? 'high' : 'auto'}
                loading={priority ? 'eager' : 'lazy'}
                crossOrigin=""
                decoding={priority ? 'sync' : 'async'}
            />
        </>
    );
};