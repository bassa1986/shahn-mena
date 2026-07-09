import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'تواصل معنا | شحن MENA',
  description: 'تواصل مع فريق شحن MENA',
}

export default function ContactPage() {
  redirect('mailto:menashahan@gmail.com?subject=استفسار%20من%20شحن%20MENA&body=مرحباً،%0A%0Aأود%20التواصل%20معكم%20بشأن...')
}
