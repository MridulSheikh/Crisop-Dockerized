'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Package,
  ShoppingCart,
  Tag,
  Tags,
  Boxes,
  Warehouse,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { hasPermission } from '@/helper/auth'
import { useAppSelector } from '@/redux/hooks'
import { useCurrentUser } from '@/redux/features/auth/authSlice'

const Sidebar = () => {
  const pathname = usePathname()
   const { handleLogout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const user = useAppSelector(useCurrentUser);

  const links = [
    { href: '/admin/product', label: 'Products', icon: Package, rules:'view:products' },
    { href: '/admin/order', label: 'Orders', icon: ShoppingCart, rules:'view:orders' },
    { href: '/admin/category', label: 'Categories', icon: Tag, rules: 'view:categorys' },
    { href: '/admin/brand', label: 'Brands', icon: Tags, rules:'view:brands'},
    { href: '/admin/stock', label: 'Stock', icon: Boxes, rules:'view:stocks' },
    { href: '/admin/warehouse', label: 'Warehouse', icon: Warehouse, rules:"view:warehouses" },
    { href: '/admin/team', label: 'Manage Team', icon: Settings, rules:"view:teams" },
  ]

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])


  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <Link href={"/"}>
        <div className="relative mb-6 h-[60px] w-[120px]">
          <Image
            src="/img/logo.png"
            alt="logo"
            fill
            sizes="120px"
            className="object-contain"
          />
        </div>
        </Link>

        {/* NAV LINKS */}
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon, rules }) => {
            if(!hasPermission(user?.role as "admin" | "manager" | "super", rules as any)){
               return null;
            }
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="mt-6 border-t pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 shadow-md lg:hidden">
        <div className="relative h-11 w-[96px]">
          <Image
            src="/img/logo.png"
            alt="logo"
            fill
            sizes="96px"
            className="object-contain"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          className="inline-flex size-10 items-center justify-center rounded-md text-gray-800 transition hover:bg-gray-100"
        >
          {!isOpen && <Menu size={24} />}
        </button>
      </header>

      {/* OVERLAY */}
      {isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-white p-4 shadow-md transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:block`}
      >
        {/* CLOSE BUTTON */}
        <div className="mb-4 flex justify-end lg:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="inline-flex size-10 items-center justify-center rounded-md text-gray-800 transition hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
