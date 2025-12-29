'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect } from 'react';
// 👇 Ensure this path is correct. If abi.json is in the 'app' folder, use './abi.json'
import abi from '../abi.json';
// 👇 Keep your previous component
import { MemberClub } from '../components/MemberClub';

// ⚠️ REPLACE THIS WITH YOUR NEW REMIX CONTRACT ADDRESS
const CONTRACT_ADDRESS = '0xC1A169532774784997Cc507119cf9D558A3aFA5a';

// ==========================================
// Component: ScoreBoard (Day 3 Logic)
// ==========================================
function ScoreBoard() {
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: score, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'score', // Ensure this matches your Remix function name (singular/plural)
  });

  // Auto-refresh logic
  useEffect(() => {
    if (isConfirmed) {
      refetch();
    }
  }, [isConfirmed, refetch]);

  const handleAddScore = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: 'addScore',
    });
  };

  if (!address) return null;

  return (
    <div className="w-full max-w-md rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">🏆 On-Chain Score</h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Current Value</span>
          <span className="text-5xl font-black text-blue-600">
            {score?.toString() || '0'}
          </span>
        </div>

        <button
          onClick={handleAddScore}
          disabled={isConfirming}
          className="rounded-lg bg-black px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-95"
        >
          {isConfirming ? 'Confirming...' : '🔥 Boost (+10)'}
        </button>
      </div>

      {isConfirmed && (
        <p className="mt-4 text-xs text-green-600 font-medium">
          ✅ Transaction Confirmed! Data updated.
        </p>
      )}
    </div>
  );
}

// ==========================================
// Main Page Layout
// ==========================================
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Web3 Gateway
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Independent Developer Journey
        </p>
      </div>

      <div className="mb-8 scale-110">
        <ConnectButton showBalance={false} />
      </div>

      {/* Grid Layout for your Apps */}
      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">

        {/* Day 1-2 Project */}
        <div className="flex justify-center">
          <MemberClub />
        </div>

        {/* Day 3 Project */}
        <div className="flex justify-center">
          <ScoreBoard />
        </div>

      </div>
    </div>
  );
}