"use client"

import { useState, useEffect } from 'react';

const ServiceItem = ({ id, title, subtitle, isSelected, onSelect }: { id: string, title: string, subtitle: string, isSelected: boolean, onSelect: (id: string) => void }) => {
    return (
        <div
            className={`w-full border-2 rounded-lg px-5 py-3 sm:px-3 sm:py-2 cursor-pointer ${isSelected ? 'border-main-500 bg-main-50' : 'border-gray-200'
                }`}
            onClick={() => onSelect(id)}
        >
            <div className="flex flex-col justify-start gap-4">
                <div className="flex flex-row items-center gap-2">
                    <input
                        type="checkbox"
                        name="service"
                        id={id}
                        checked={isSelected}
                        onChange={() => onSelect(id)}
                        className="accent-main-500 rounded-lg w-[18px] h-[18px]"
                    />
                    <h1 className='text-gray-800 font-semibold text-sm md:text-base'>{title}</h1>
                </div>
                {subtitle && <label htmlFor={id} className='text-gray-800 cursor-pointer text-xs font-medium flex'>{subtitle}</label>}
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
        <div className="w-full mb-5">
            <h1 className="font-bold text-gray-800 mb-3 dark:text-gray-200">선택 서비스</h1>
            <div className="w-full flex flex-row gap-5">
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
        </div>
    );
}