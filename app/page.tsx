import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MemberClub } from '../components/MemberClub';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">My Web3 Gateway</h1>
      <ConnectButton />
      <MemberClub />
    </div>
  );
}
