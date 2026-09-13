import RegisterForm from "./components/mobile/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <div className="block md:hidden">
        <RegisterForm />
      </div>
      <div className="hidden md:block">
        <RegisterForm />
      </div>
    </>
  );
}
