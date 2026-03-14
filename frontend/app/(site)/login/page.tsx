import LoginForm from "@/components/Forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">E</div>
        <span className="text-2xl font-black text-primary tracking-tight">EduSense</span>
      </div>
      
      <LoginForm />
    </div>
  );
}