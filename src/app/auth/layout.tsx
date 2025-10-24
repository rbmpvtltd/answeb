export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="flex items-center justify-center min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}