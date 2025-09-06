'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Yeh component ek "Bouncer" ki tarah kaam karega.
// Yeh 'children' prop leta hai, jiska matlab hai ki yeh kisi bhi doosre component ko protect kar sakta hai.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    // Yeh state batayegi ki bouncer ne checking poori kar li hai ya nahi.
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        // Step 1: Bouncer check karega ki customer ke paas ticket (token) hai ya nahi.
        const token = localStorage.getItem('blog_token');

        // Step 2: Agar ticket hi nahi hai, toh seedha login page par bhej do.
        if (!token) {
            router.push('/login');
        } else {
            // Step 3: Agar ticket hai, toh maan lo ki woh a valid hai (asli verification backend se hoti hai).
            // Ab customer ko andar aane ki permission do.
            setIsVerified(true);
        }
    }, [router]); // useEffect ko router par depend karwaya.

    // Jab tak bouncer checking kar raha hai (isVerified false hai), ek loading message dikhao.
    if (!isVerified) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    // Agar checking poori ho gayi hai aur ticket mil gaya hai, toh customer ko VIP section (dashboard) dikha do.
    return <>{children}</>;
};

export default ProtectedRoute;