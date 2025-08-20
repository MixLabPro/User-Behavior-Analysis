import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '从零到一：Sarah的AI创造之旅',
  description: '一位产品经理如何用AI编程打造家庭健康管理平台，实现从使用者到创造者的蜕变',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
