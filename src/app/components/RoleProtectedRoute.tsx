'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Naya tool import kiya

// Yeh component ek "Super Bouncer" ki tarah kaam karega.
// Yeh 'requiredRole' prop leta hai, jisse hum batayenge ki is page ke liye kaun sa role zaroori hai.
const RoleProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: 'user' | 'admin' }) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // 1. Bouncer ticket (token) check karega.
        const token = localStorage.getItem('blog_token');

        // 2. Agar ticket hi nahi hai, toh seedha login page par bhej do.
        if (!token) {
            router.push('/login');
            return; // Aage ka code mat chalao
        }

        try {
            // 3. Ticket ke andar jhaank kar dekho (decode karo).
            const decodedToken: { user: { role: string } } = jwtDecode(token);
            const userRole = decodedToken.user.role;

            // 4. Faisla lo: Kya user ka role is page ke zaroori role se match karta hai?
            if (userRole === requiredRole) {
                // Haan, match karta hai. Entry de do.
                setIsAuthorized(true);
            } else {
                // Nahi, match nahi karta. Isko iske sahi dashboard par bhejo.
                if (userRole === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            // Agar ticket hi galat (tampered) hai, toh login page par bhej do.
            console.error("Invalid token:", error);
            router.push('/login');
        }

    }, [router, requiredRole]);

    // Jab tak bouncer checking kar raha hai, ek loading message dikhao.
    if (!isAuthorized) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Checking permissions...</p>
            </div>
        );
    }

    // Agar sab kuch theek hai, toh page dikha do.
    return <>{children}</>;
};

export default RoleProtectedRoute;