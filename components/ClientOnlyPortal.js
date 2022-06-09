import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// 传送门构造器
export default function ClientOnlyPortal({ children, selector }) {
  const ref = useRef()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 获取传送门挂载点
    ref.current = document.querySelector(selector)
    setMounted(true)
  }, [selector])

  return mounted ? createPortal(children, ref.current) : null
}
