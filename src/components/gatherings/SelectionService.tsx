"use client"

import { useState, useEffect } from 'react';

const ServiceItem = ({ id, title, subtitle, isSelected, onSelect }: { id: string, title: string, subtitle: string, isSelected: boolean, onSelect: (id: string) => void }) => {
    return (
        <div
            role="radio"
            aria-checked={isSelected}
            className={`w-full border-2 rounded-lg px-5 py-3 sm:px-3 sm:py-2 cursor-pointer ${isSelected ? 'border-main-500 bg-main-50' : 'border-gray-200 dark:border-gray-700 dark:text-white'}`}
            onClick={() => onSelect(id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(id);
                }
            }}
            tabIndex={0}
        >
            <div className="flex flex-col justify-start gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                        type="radio"
                        name="service"
                        id={id}
                        checked={isSelected}
                        onChange={() => onSelect(id)}
                        className="accent-main-500 rounded-lg w-[18px] h-[18px]"
                        aria-label={`${title} ${subtitle ? subtitle : ''} 선택`}
                    />
                    <h3 className='font-semibold text-xs sm:text-sm md:text-base'>{title}</h3>
                </div>
                {subtitle && (
                    <span className='text-2xs sm:text-xs font-medium flex items-center sm:items-start text-gray-600 dark:text-gray-300'>
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
};

// 부모 컴포넌트에서 선택된 서비스와 onChange 핸들러를 받음
export default function SelectionService({
    selectedType = 'OFFICE_STRETCHING',
    onSelect
}: {
    selectedType?: string,
    onSelect: (type: string) => void
}) {
    // 선택된 서비스 상태 관리
    const [selectedServices, setSelectedServices] = useState(selectedType);

    // selectedType prop이 변경되면 내부 상태도 업데이트
    useEffect(() => {
        setSelectedServices(selectedType);
    }, [selectedType]);

    // 서비스 선택 핸들러
    const handleServiceSelection = (serviceName: string) => {
        setSelectedServices(serviceName);
        onSelect(serviceName); // 부모 컴포넌트에 선택 전달
        return serviceName;
    };

    // 서비스 데이터
    const services = [
        {
            id: 'OFFICE_STRETCHING',
            title: '북적북적',
            subtitle: '엔터테인먼트'
        },
        {
            id: 'MINDFULNESS',
            title: '북적북적',
            subtitle: '액티비티'
        },
        {
            id: 'WORKATION',
            title: '도란도란',
            subtitle: null
        }
    ];

    return (
        <fieldset className="w-full mb-5">
            <legend className="font-bold text-gray-800 mb-3 dark:text-gray-200">선택 서비스</legend>
            <div
                className="w-full flex flex-row gap-5"
                role="radiogroup"
                aria-label="서비스 유형 선택"
            >
                {services.map((service) => (
                    <ServiceItem
                        key={service.id}
                        id={service.id}
                        title={service.title}
                        subtitle={service.subtitle || ''}
                        isSelected={selectedServices === service.id}
                        onSelect={handleServiceSelection}
                    />
                ))}
            </div>
        </fieldset>
    );
}