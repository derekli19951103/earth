import "./globals.css";
import "antd/dist/reset.css";

export const metadata = {
  title: "Earth",
  description: "Mark your journey on earth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
