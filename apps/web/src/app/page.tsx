import { WALLET_PROVIDERS } from '@stellar-starter-kit/wallets';
import { cn } from '@stellar-starter-kit/ui';

export default function Home() {
  return (
    <main className="min-height-screen relative flex flex-col items-center justify-center overflow-hidden p-6 md:p-24">
      {/* Decorative background lights */}
      <div className="animate-pulse-slow pointer-events-none absolute left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-purple-900/20 blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-900/10 blur-[120px]"></div>

      <div className="z-10 flex w-full max-w-5xl flex-col items-center justify-between text-sm">
        {/* Header Badge */}
        <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-300">
          <span className="h-2 w-2 animate-ping rounded-full bg-purple-400"></span>
          Now Live: Next.js 15 + Soroban Support
        </div>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
            stellar-starter-kit
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            The fastest way to build modern, production-ready Stellar and Soroban applications.
          </p>
        </div>

        {/* Grid Section */}
        <div className="mb-12 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div
            className={cn(
              'glass glass-hover group flex flex-col justify-between rounded-2xl p-6 transition-all duration-300',
            )}
          >
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400">
                📦
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Monorepo Setup</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Powered by Turborepo and pnpm workspaces. Fast builds, cached steps, and modular
                design.
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-purple-400 transition-transform group-hover:translate-x-1">
              Learn architecture &rarr;
            </div>
          </div>

          {/* Card 2 */}
          <div
            className={cn(
              'glass glass-hover group flex flex-col justify-between rounded-2xl p-6 transition-all duration-300',
            )}
          >
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                💳
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Wallet Integration</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Connect and interact seamlessly using Freighter, Albedo, Rabe, or Hana.
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-cyan-400">
              Supported Wallets: {Object.values(WALLET_PROVIDERS).join(', ')}
            </div>
          </div>

          {/* Card 3 */}
          <div
            className={cn(
              'glass glass-hover group flex flex-col justify-between rounded-2xl p-6 transition-all duration-300',
            )}
          >
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-pink-500/20 bg-pink-500/10 text-pink-400">
                ⚡
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Soroban Integration</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                WASM compilation bindings and React hooks for instant smart contract execution.
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-pink-400 transition-transform group-hover:translate-x-1">
              Explore examples &rarr;
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 w-full border-t border-slate-800/60 pt-8 text-center text-xs text-slate-500">
          Built as an open-source flagship toolkit for the Stellar & Soroban ecosystem.
        </div>
      </div>
    </main>
  );
}
