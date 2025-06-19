'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
    src: string;
    fallbackSrc: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    sizes?: string;
    quality?: number;
}

export default function ImageWithFallback(props: ImageWithFallbackProps) {
    const { 
        src, 
        fallbackSrc, 
        alt, 
        width, 
        height, 
        className, 
        priority = false,
        loading = 'lazy',
        sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 320px, 280px',
        quality = 75, // 기본 품질을 75로 설정하여 파일 크기 최적화
        ...rest 
    } = props;

    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            onError={() => {
                console.log('이미지 로드 실패 => fallback 이미지 적용');
                setImgSrc(fallbackSrc);
            }}
            width={width}
            height={height}
            className={className}
            priority={priority}
            loading={loading}
            sizes={sizes}
            quality={quality}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyKCckknqTzSlT54b6bk+h0R//Z" // 로딩 시 블러 효과
        />
    );
}