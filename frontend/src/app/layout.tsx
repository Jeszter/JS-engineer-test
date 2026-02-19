import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Quiz Builder | Abstract Inspiration',
    description: 'Create and manage quizzes with elegant design',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <nav className="bg-[#CABEA9]/30 backdrop-blur-md border-b border-[#95867B]/30 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <a href="/" className="flex items-center space-x-2">
                  <span className="text-2xl font-bold gradient-text">
                    QuizBuilder
                  </span>
                        </a>
                        <div className="hidden md:flex items-center space-x-2">
                            <a href="/" className="nav-link">Home</a>
                            <a href="/create" className="nav-link">Create</a>
                            <a href="/quizzes" className="nav-link">My Quizzes</a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">

                    </div>
                </div>
            </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
            {children}
        </main>
        </body>
        </html>
    )
}