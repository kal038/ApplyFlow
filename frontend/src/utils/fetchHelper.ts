import { useAuthStore } from "@/store/useAuthStore";
import { toast } from 'react-hot-toast'

interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch(url: string, options: ApiFetchOptions = {}) {
    const res = await fetch(url, {...options, credentials: 'include'
        , headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (res.status === 401) {
        const {logout} = useAuthStore.getState();
        await logout();

        toast.error("Your session has expired. Redirecting to login...", {duration : 5000});
        await new Promise(resolve => setTimeout(resolve, 10000));
        window.location.href = '/login';
        throw new Error('Session Expired');
    }
    
    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json(); //valid response
}