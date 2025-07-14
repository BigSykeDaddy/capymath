import Link from 'next/link';
import Image from 'next/image';

export default function BackToMenu() {
    return (
        <div className="flex flex-col items-center mt-10 mb-10">
            <Image
                src="/capy-loading.png"
                alt="Capybara"
                width={60}
                height={60}
                className="mb-3"
            />
            <Link href="/menu">
                <button className="bg-[var(--color-accent)] text-white font-semibold py-3 px-4 rounded-full hover:bg-[var(--color-accent-hover,#f76552)] transition">
                    Back to Menu
                </button>
            </Link>
        </div>
    );
}
