import UserRoutes from "@/routes/UserRoutes";
import { Toaster } from "@/components/ui/sonner";
import AdminRoutes from "@/routes/AdminRoutes";

function App() {
  return (
    <>
    <Toaster />
      <UserRoutes />
      <AdminRoutes />
    </>
  );
}  

export default App;
