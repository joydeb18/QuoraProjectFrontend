'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        // === YEH HAI ASLI BADLAV ===
        // Hum pehle check kar rahe hain ki hum browser mein hain ya nahi
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('blog_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const decodedToken: { exp: number } = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem('blog_token');
                    localStorage.removeItem('blog_user');
                    router.push('/login');
                } else {
                    setIsVerified(true);
                }
            } catch (error) {
                localStorage.removeItem('blog_token');
                localStorage.removeItem('blog_user');
                router.push('/login');
            }
        }
    }, [router]);

    if (!isVerified) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Checking Access...</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;