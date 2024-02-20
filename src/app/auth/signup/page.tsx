import ContainerForm from "@/components/ContainerForm";
import { SignupForm } from "../ui/SignupForm";
import Link from "next/link";

export const metadata = {
  title: "Habits tracker - Sign Up",
  description: "Sign up for a new account",
};

export default function SignInPage() {
  return (
    <div>
      <ContainerForm>
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Build your habits
        </h1>
        <SignupForm />
        <div className="text-center mt-6">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline hover:text-white/80">
              Log in
            </Link>
          </p>
        </div>
      </ContainerForm>
    </div>
  );
}
