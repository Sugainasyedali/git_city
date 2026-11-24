import "./style.css";
export const metadata = {
  title: "GitVerse · The Developer Universe",
  description: "Explore a living, interactive 3D repository city.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
