import { SwapTokenBox } from "@/components/organisms/SwapForm";

export default function SwapPage() {
    return (
        <div
            className="min-h-screen w-full bg-[#131314] flex items-center justify-center relative overflow-hidden"
            style={{
                backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 100%)`
            }}
        >
            {/* Starfield background layer */}
            <div className="fixed inset-0 z-0 pointer-events-none" style={{
                backgroundImage: `url('/star-bg.png')`,
                backgroundRepeat: 'repeat',
                opacity: .32,
                mixBlendMode: 'screen',
            }}></div>
            {/* Swap form center */}
            <SwapTokenBox />
        </div>
    );
}
