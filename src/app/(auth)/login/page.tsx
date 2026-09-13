import LoginForm from "./components/mobile/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="block md:hidden">
        <LoginForm />
      </div>
      <div className="hidden md:block">
        <LoginForm />
      </div>
    </>
  );
}
