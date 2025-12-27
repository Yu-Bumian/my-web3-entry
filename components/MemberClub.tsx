'use client';

import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';

import { motion } from 'framer-motion';

export function MemberClub() {
    const { address, isConnected } = useAccount();
    const { data: balance, isLoading } = useBalance({
        address,
    });

    const { data: hash, isPending, sendTransaction, error } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    if (!isConnected) {
        return (
            <div className="mt-8 text-center">
                <p className="text-xl font-semibold text-gray-700">
                    🔒 Please connect your wallet to enter.
                </p>
            </div>
        );
    }

    if (isLoading || !balance) {
        return (
            <div className="mt-8 flex h-64 w-96 animate-pulse flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
                <div className="mb-4 h-8 w-48 rounded bg-gray-200"></div>
                <div className="h-4 w-32 rounded bg-gray-200"></div>
            </div>
        );
    }

    // 0.01 ETH check
    const isVIP = parseFloat(balance.formatted) >= 0.001;

    if (isVIP) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5 }}
                className="mt-8 flex w-full max-w-md flex-col items-center rounded-xl border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white p-8 text-center shadow-lg"
            >
                <div className="mb-4 text-4xl">💎</div>
                <h2 className="mb-2 text-2xl font-bold text-yellow-800">
                    Welcome, VIP Member
                </h2>
                <p className="mb-6 text-yellow-700">
                    You hold {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}.
                    Access granted to exclusive features.
                </p>
                <div className="flex h-32 w-full items-center justify-center rounded-lg bg-yellow-100 text-yellow-400 mb-6">
                    [Exclusive VIP Content Image]
                </div>

                <button
                    disabled={isPending || isConfirming}
                    onClick={() =>
                        sendTransaction({
                            to: '0xA6Ef3740c07fA0157D28554450eFFF0FE15eeAa9',
                            value: parseEther('0.0001'),
                        })
                    }
                    className="rounded-full bg-yellow-500 px-6 py-2 font-bold text-white transition-colors hover:bg-yellow-600 disabled:bg-gray-400"
                >
                    {isPending ? 'Opening Wallet...' : isConfirming ? 'Confirming...' : '☕ Buy me a Coffee (0.0001 ETH)'}
                </button>

                {isSuccess && (
                    <div className="mt-4 text-green-600">
                        Success! Hash: {hash?.slice(0, 6)}...{hash?.slice(-4)}
                    </div>
                )}
                {error && (
                    <div className="mt-4 text-red-500">
                        Error: {error.message.slice(0, 50)}...
                    </div>
                )}
            </motion.div>
        );
    }

    return (
        <div className="mt-8 flex w-full max-w-md flex-col items-center rounded-xl border-2 border-gray-300 bg-gray-50 p-8 text-center shadow-sm">
            <div className="mb-4 text-4xl">🚫</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Restricted Access
            </h2>
            <p className="mb-6 text-gray-600">
                Insufficient Funds. You need 0.01 ETH to view this content. <br />
                Current balance: {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-200 blur-sm">
                {/* Blurred content placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    Hidden
                </div>
            </div>
        </div>
    );
}
