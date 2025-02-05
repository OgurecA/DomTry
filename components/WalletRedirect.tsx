import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';

const WalletRedirect = () => {
    const { publicKey, connected, disconnect } = useWallet();
    const router = useRouter();

    useEffect(() => {
        const handleRedirect = async () => {
            try {
                if (publicKey) {
                    console.log("Кошелек подключен. Перенаправляем в /office...");
                    await router.replace('/office');
                } else {
                    console.log("Кошелек отключен. Ждем завершения disconnect()...");
                    await disconnect().catch((err) => console.error("Ошибка disconnect():", err));
                    console.log("Disconnect завершен. Перенаправляем в /");
                    await router.replace('/');
                }
            } catch (error) {
                console.error("Ошибка при редиректе:", error);
            }
        };

        handleRedirect();
    }, [publicKey]);

    return null;
};

export default WalletRedirect;
