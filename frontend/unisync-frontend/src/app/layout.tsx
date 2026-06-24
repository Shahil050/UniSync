import "../styles/index.css";
import { UserProvider } from "./UserContext";
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
          {children}
          <ModalsRenderer />
        </UserProvider>
      </body>
    </html>
  );
}