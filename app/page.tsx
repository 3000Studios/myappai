import Image from "next/image";
import Link from "next/link";

import { getStores } from "@/lib/mixedbread";
import mixedbreadLogo from "@/public/mixedbread_logo.svg";
import vercelLogo from "@/public/vercel_logo.svg";

export default async function Home() {
  const { stores, error } = await getStores();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full border-b border-[#E4E5E7] dark:border-[#303236]">
        <div className="mx-auto flex w-full max-w-md items-center px-5 py-3 sm:py-4 md:max-w-lg lg:max-w-xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              className="h-5 w-auto sm:h-6"
              src={vercelLogo}
              alt="Vercel logo"
              width={88}
              height={24}
              priority
            />
            <span className="text-sm text-[#61646B] dark:text-[#94979E] sm:text-base">
              /
            </span>
            <Image
              className="h-5 w-auto sm:h-6"
              src={mixedbreadLogo}
              alt="Mixedbread logo"
              width={88}
              height={24}
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 md:max-w-lg lg:max-w-xl">
        <main className="flex flex-1 flex-col justify-center py-8 sm:py-12">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl font-semibold leading-tight tracking-tighter mb-4 sm:text-3xl sm:mb-6 md:text-4xl lg:text-5xl">
              Vercel with Mixedbread
            </h1>
            <h2 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">
              Your Stores
            </h2>

            {!error && stores.length > 0 ? (
              <ul className="space-y-2 sm:space-y-3">
                {stores.map((store) => (
                  <li
                    key={store.id}
                    className="border border-[#E4E5E7] dark:border-[#303236] rounded-lg p-3 sm:p-4"
                  >
                    <div className="text-xs sm:text-sm">
                      <span className="text-[#61646B] dark:text-[#94979E]">
                        Name:
                      </span>{" "}
                      <span className="font-medium">{store.name}</span>
                    </div>
                    <div className="text-xs sm:text-sm mt-2">
                      <span className="text-[#61646B] dark:text-[#94979E]">
                        Files ingested:
                      </span>{" "}
                      <span className="font-medium">
                        {store.file_counts?.total || 0}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="border border-[#E4E5E7] dark:border-[#303236] rounded-lg p-4 sm:p-6 text-center">
                <p className="text-xs sm:text-sm text-[#61646B] dark:text-[#94979E] mb-3">
                  No stores created yet
                </p>
                <Link
                  className="text-xs sm:text-sm font-medium hover:underline"
                  href="https://vercel.com/dashboard"
                  target="_blank"
                >
                  Create a store on Vercel
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-all h-9 px-4 sm:h-10 sm:px-6 sm:text-sm bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmixedbread-ai%2Fvercel-marketplace-mixedbread%2Ftree%2Fmain&project-name=my-vercel-mixedbread-app&repository-name=my-vercel-mixedbread-app"
              target="_blank"
            >
              Deploy to Vercel
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-all h-9 px-4 sm:h-10 sm:px-6 sm:text-sm border border-[#E4E5E7] hover:bg-black/5 dark:border-[#303236] dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              href="https://github.com/mixedbread-ai/vercel-marketplace-mixedbread"
              target="_blank"
            >
              View on GitHub
            </Link>
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E5E7] py-4 sm:py-5 md:pb-12 md:pt-10 dark:border-[#303236]">
          <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              className="text-xs sm:text-sm tracking-tight opacity-70 transition-opacity duration-200 hover:opacity-100"
              href="https://www.mixedbread.com"
              target="_blank"
            >
              Mixedbread
            </Link>
            <Link
              className="text-xs sm:text-sm tracking-tight opacity-70 transition-opacity duration-200 hover:opacity-100"
              href="https://www.mixedbread.com/docs"
              target="_blank"
            >
              Docs
            </Link>
            <Link
              className="text-xs sm:text-sm tracking-tight opacity-70 transition-opacity duration-200 hover:opacity-100"
              href="https://discord.gg/fCpaq2dr"
              target="_blank"
            >
              Discord
            </Link>
          </ul>
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              !error
                ? "border-[#FF6B35]/20 bg-[#FF6B35]/10 text-[#FF6B35]"
                : "border-red-500/20 bg-red-500/10 text-red-500"
            }`}
          >
            {error || "Connected"}
          </span>
        </footer>
      </div>
    </div>
  );
}
