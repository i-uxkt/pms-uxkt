
import "./globals.css";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="px-4 lg:px-6 h-16 flex items-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
            <Link href="/" className="flex items-center justify-center group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200 group-hover:scale-105 transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <div className="ml-3 hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  TopShine
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Precision Manufacturing
                </div>
              </div>
            </Link>
            
            <SearchBar />
            
            <nav className="ml-auto flex items-center gap-1 sm:gap-2">
              <Link 
                href="/#case-studies-section" 
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all duration-200"
              >
                Case Studies
              </Link>
              <Link 
                href="/#knowledge-base-section" 
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all duration-200"
              >
                Knowledge Base
              </Link>
              <a 
                href="#contact-section" 
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all duration-200"
              >
                Contact
              </a>
              <Link 
                href="/submit-project" 
                className="ml-2 inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
              >
                Get Quote
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </nav>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer id="contact-section" className="bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 text-white">
            <div className="container mx-auto px-4 md:px-6 py-16">
              {/* Main Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Company Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        TopShine
                      </span>
                      <div className="text-sm text-gray-400 font-medium">
                        Precision Manufacturing
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed max-w-md">
                    Transform complex design challenges into flawless reality through our global manufacturing network and world-class facilities, orchestrated with precision intelligence.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>ISO 9001 Certified • ±0.005mm Tolerance • IP Protected</span>
                  </div>
                </div>
                
                {/* Quick Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Services</h3>
                  <div className="space-y-2">
                    <Link href="/#case-studies-section" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">
                      Case Studies
                    </Link>
                    <Link href="/#knowledge-base-section" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">
                      Knowledge Base
                    </Link>
                    <Link href="/submit-project" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">
                      Submit Project
                    </Link>
                  </div>
                </div>
                
                {/* Contact & Legal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contact & Legal</h3>
                  <div className="space-y-3">
                    <a 
                      href="mailto:dshimiga@hotmail.com" 
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors text-sm group"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      dshimiga@hotmail.com
                    </a>
                    <Link 
                      href="/legal/msa" 
                      className="block text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      Master Service Agreement
                    </Link>
                    <Link 
                      href="/legal/nda" 
                      className="block text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      Non-Disclosure Agreement
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Bottom Bar */}
              <div className="pt-8 border-t border-gray-800">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-400">
                    © 2024 Shenzhen Top Shine Electronic Co Ltd. All rights reserved.
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Accepting New Projects</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Built with precision & care
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
