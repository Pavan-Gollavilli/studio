import TokenManager from '@/components/canteen/TokenManager';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl">
        <TokenManager />
      </div>
    </main>
  );
}
