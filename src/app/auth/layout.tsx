// app/auth/layout.tsx
"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex items-center justify-center min-h-screen">
        {children}
      </body>
    </html>
  );
}
