import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
    src: string;
    fallbackSrc: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}

export default function ImageWithFallback(props: ImageWithFallbackProps) {
    const { src, fallbackSrc, alt, width, height, className, ...rest } = props;

    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            onError={() => {
                console.log('이미지 로드 실패, fallback 이미지 적용');
                setImgSrc(fallbackSrc)
            }}
            width={width}
            height={height}
            className={className}
        />
    );
};