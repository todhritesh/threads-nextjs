import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"

export const metadata = {
    title:"Threads",
    description:"A Next.Js Meta Threads Application"
}


const inter = Inter({subsets:['latin']})
import '../globals.css'
export default function RootLayout({children}:{children:React.ReactNode}){
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}  >
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}

