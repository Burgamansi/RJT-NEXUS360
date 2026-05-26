import { MaterialIcon } from "../ui/MaterialIcon";

const commands = ["search", "terminal", "notifications_active", "sync"];

export function MobileCommandBar() {
  return (
    <nav className="fixed bottom-8 left-1/2 z-50 flex w-auto -translate-x-1/2 items-center gap-8 rounded-full border border-white/10 bg-primary-container/90 px-6 py-3 shadow-[0_20px_50px_rgba(0,107,255,0.22)] backdrop-blur-md md:hidden">
      {commands.map((command, index) => (
        <MaterialIcon
          key={command}
          name={command}
          className={`cursor-pointer transition-transform hover:scale-110 ${
            index === 1 ? "scale-110 text-electric-blue drop-shadow-[0_0_8px_rgba(0,200,255,0.72)]" : "text-white/60"
          }`}
        />
      ))}
    </nav>
  );
}
