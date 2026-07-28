import "../styles/index.css";
import { UserProvider } from "./UserContext";
import { Navbar } from "./components/Navbar";
import { ModalsRenderer } from "./ModalsRenderer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar />
            {children}
          </div>
          <ModalsRenderer />
        </UserProvider>
      </body>
    </html>
  );
}