'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function IdPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  useEffect(() => {
    // Navigate to the next route immediately
    router.replace('/completed')
  }, [router])

  return <p className="p-4">Loading...</p>
}
