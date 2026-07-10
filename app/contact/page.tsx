"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ContactPage() {
  const router = useRouter()
  useEffect(() => {
    window.location.href = "mailto:menashahan@gmail.com?subject=Inquiry from Shahn MENA"
    setTimeout(() => router.push("/"), 1000)
  }, [router])
  return null
}