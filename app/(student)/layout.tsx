import "@/app/globals.css";
import TeacherSidebar from "@/components/Sidebar/TeacherSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-primary">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <TeacherSidebar />
          {/* Main Content */}
          <main className="flex-1 lg:ml-64 bg-background pt-16 lg:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}