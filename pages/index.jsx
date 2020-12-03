import dynamic from 'next/dynamic'
import 'tailwindcss/tailwind.css'

const App = dynamic(import('components/app'), { ssr: false })

export default function Home() {
  return <App />
}
