import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { withUt } from "uploadthing/tw";
export default withUt({
  content: ["./src/**/*.{ts,tsx,mdx}"],
  safelist: [
    "text-blue-600",
    "text-red-600",
    "text-green-600",
    "text-yellow-600",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}) satisfies Config;
