'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

// 테마 모드 타입
type ThemeMode = "light" | "dark" | "system";

// 테마 순환 로직
const getNextTheme = (current: ThemeMode): ThemeMode => {
    switch (current) {
        case "light":
            return "dark";
        case "dark":
            return "system";
        case "system":
            return "light";
        default:
            return "light";
    }
};

// 테마 정보 조회 로직
const getThemeInfo = (theme: ThemeMode) => {
    switch (theme) {
        case "light":
            return {
                icon: Sun,
                color: "text-yellow-500",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                label: "라이트",
                fullLabel: "라이트 모드",
                description: "밝은 테마"
            };
        case "dark":
            return {
                icon: Moon,
                color: "text-blue-400",
                bgColor: "bg-blue-50 dark:bg-blue-900/20",
                label: "다크",
                fullLabel: "다크 모드",
                description: "어두운 테마"
            };
        case "system":
            return {
                icon: Monitor,
                color: "text-gray-600 dark:text-gray-400",
                bgColor: "bg-gray-50 dark:bg-gray-800",
                label: "시스템",
                fullLabel: "시스템 모드",
                description: "시스템 설정 따름"
            };
        default:
            return {
                icon: Sun,
                color: "text-yellow-500",
                bgColor: "bg-yellow-50",
                label: "라이트",
                fullLabel: "라이트 모드",
                description: "밝은 테마"
            };
    }
};

// 테마 상태 관리 훅
const useThemeState = () => {
    const { toggleDarkMode } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<ThemeMode>("system");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
            if (savedTheme) {
                setCurrentTheme(savedTheme);
            } else {
                setCurrentTheme("system");
            }
        }
    }, []);

    const handleToggle = () => {
        const nextTheme = getNextTheme(currentTheme);
        setCurrentTheme(nextTheme);
        toggleDarkMode(nextTheme);
    };

    return {
        currentTheme,
        handleToggle,
        currentThemeInfo: getThemeInfo(currentTheme),
        nextThemeInfo: getThemeInfo(getNextTheme(currentTheme))
    };
};

/**
 * 테마 토글 버튼
 * @returns 테마 토글 버튼
 */
export function DarkModeToggleButton() {
    const { handleToggle, currentThemeInfo, nextThemeInfo } = useThemeState();
    const CurrentIcon = currentThemeInfo.icon;

    return (
        <button
            onClick={handleToggle}
            className={`p-2.5 rounded-full border border-gray-300 dark:border-gray-600 flex justify-center items-center hover:scale-105 transition-all duration-200 group ${currentThemeInfo.bgColor} cursor-pointer`}
            aria-label={`현재: ${currentThemeInfo.fullLabel}. 클릭하여 ${nextThemeInfo.fullLabel}로 전환`}
            title={currentThemeInfo.fullLabel}
        >
            <CurrentIcon
                size={18}
                className={`${currentThemeInfo.color} transition-all duration-300`}
            />
        </button>
    );
}

// 라벨 포함 토글 버튼
export function DarkModeToggleWithLabel() {
    const { handleToggle, currentThemeInfo } = useThemeState();
    const CurrentIcon = currentThemeInfo.icon;

    return (
        <button
            onClick={handleToggle}
            className={`px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 flex justify-center items-center gap-2 hover:scale-105 transition-all duration-200 ${currentThemeInfo.bgColor}`}
            aria-label={`현재: ${currentThemeInfo.description}. 클릭하여 전환`}
        >
            <CurrentIcon
                size={16}
                className={`${currentThemeInfo.color} transition-all duration-300`}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentThemeInfo.label}
            </span>
        </button>
    );
}

// =================================================================================================
// 테마 선택 버튼 그룹
// =================================================================================================

const useThemeSelector = () => {
    const { toggleDarkMode } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<ThemeMode>("system");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
            if (savedTheme) {
                setCurrentTheme(savedTheme);
            } else {
                setCurrentTheme("system");
            }
        }
    }, []);

    const selectTheme = (theme: ThemeMode) => {
        setCurrentTheme(theme);
        toggleDarkMode(theme);
    };

    return {
        currentTheme,
        selectTheme,
    };
}

export function ThemeSelectionButtons() {
    const { currentTheme, selectTheme } = useThemeSelector();
    const themes: ThemeMode[] = ["light", "dark", "system"];

    return (
        <div className="flex items-center gap-2 p-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
            {themes.map((theme) => {
                const themeInfo = getThemeInfo(theme);
                const Icon = themeInfo.icon;
                const isActive = currentTheme === theme;

                return (
                    <button
                        key={theme}
                        onClick={() => selectTheme(theme)}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${isActive
                            ? "bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-100 shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                            }`}
                        aria-pressed={isActive}
                        title={themeInfo.fullLabel}
                    >
                        <Icon size={16} className={isActive ? themeInfo.color : ""} />
                    </button>
                );
            })}
        </div>
    );
}