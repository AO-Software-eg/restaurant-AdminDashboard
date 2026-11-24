"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
    ChevronLeft,
    ChevronRight,
    Home,
    ShoppingCart,
    Utensils,
    Users,
    Wallet,
} from "lucide-react"


const SideNavItems = [
    {
        name: "الصفحة الرئيسية",
        href: "/",
        icon: <Home size={20} />,
    },
    {
        name: "الطلبات",
        href: "/orders",
        icon: <ShoppingCart size={20} />,
    },
    {
        name: "المنيو",
        href: "/menu",
        icon: <Utensils size={20} />,
    },
    {
        name: "العملاء",
        href: "/customers",
        icon: <Users size={20} />,
    },
    {
        name: "المحفظة",
        href: "/wallet",
        icon: <Wallet size={20} />,
    },
]

const MIN_WIDTH = 72
const MAX_WIDTH = 320
const DEFAULT_WIDTH = 256
const MOBILE_BREAKPOINT = 768

function SideNav() {
    const [width, setWidth] = useState(DEFAULT_WIDTH)
    const [isResizing, setIsResizing] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [desktopWidth, setDesktopWidth] = useState(DEFAULT_WIDTH)
    const asideRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)

        const updateScreenSize = () => {
            setIsSmallScreen(mediaQuery.matches)
            setWidth(mediaQuery.matches ? MIN_WIDTH : desktopWidth)
        }

        updateScreenSize()
        mediaQuery.addEventListener("change", updateScreenSize)

        return () => mediaQuery.removeEventListener("change", updateScreenSize)
    }, [desktopWidth])

    useEffect(() => {
        if (!isResizing) return

        const handlePointerMove = (event: PointerEvent) => {
            if (!asideRef.current) return

            const rect = asideRef.current.getBoundingClientRect()
            const nextWidth = rect.right - event.clientX
            const resizedWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, nextWidth))
            setWidth(resizedWidth)
            setDesktopWidth(resizedWidth)
        }

        const stopResizing = () => setIsResizing(false)

        document.body.style.cursor = "col-resize"
        document.body.style.userSelect = "none"
        window.addEventListener("pointermove", handlePointerMove)
        window.addEventListener("pointerup", stopResizing)

        return () => {
            document.body.style.cursor = ""
            document.body.style.userSelect = ""
            window.removeEventListener("pointermove", handlePointerMove)
            window.removeEventListener("pointerup", stopResizing)
        }
    }, [isResizing])

    const isCollapsed = width <= 110

    useEffect(() => {
        if (!isSmallScreen || isCollapsed) return

        const handleOutsidePointerDown = (event: PointerEvent) => {
            if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
                setWidth(MIN_WIDTH)
            }
        }

        document.addEventListener("pointerdown", handleOutsidePointerDown)
        return () => document.removeEventListener("pointerdown", handleOutsidePointerDown)
    }, [isSmallScreen, isCollapsed])

    const toggleMobileMenu = () => {
        if (isSmallScreen && isCollapsed) {
            setWidth(DEFAULT_WIDTH)
        }
    }

    return (
        <aside
            ref={asideRef}
            style={{ width }}
            onClick={toggleMobileMenu}
            className="relative h-screen shrink-0 border-l border-gray-200 bg-white p-4 transition-[width] duration-200 shadow-lg"
        >
            <button
                type="button"
                aria-label={isSmallScreen ? (isCollapsed ? "فتح القائمة الجانبية" : "طي القائمة الجانبية") : (isCollapsed ? "فتح القائمة الجانبية" : "تغيير عرض القائمة الجانبية")}
                onPointerDown={(event) => {
                    event.stopPropagation()

                    if (isSmallScreen) {
                        setWidth(isCollapsed ? DEFAULT_WIDTH : MIN_WIDTH)
                    } else {
                        setIsResizing(true)
                    }
                }}
                className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md cursor-col-resize touch-none transition-colors hover:bg-gray-100"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <nav>
                <ul className="space-y-2">
                    {SideNavItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={(event) => {
                                    if (isSmallScreen && isCollapsed) event.preventDefault()
                                }}
                                title={isCollapsed ? item.name : undefined}
                                className={`flex items-center rounded-lg py-3 text-gray-700 transition-colors hover:bg-gray-100 hover:text-black ${isCollapsed ? "justify-center px-2" : "gap-3 px-4"}`}
                            >
                                {item.icon}
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default SideNav
