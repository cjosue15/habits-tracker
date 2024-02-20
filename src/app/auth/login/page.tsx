import Link from "next/link";

import ContainerForm from "@/components/ContainerForm";
import { ArrowRightIcon } from "@/components/icons";
import { LoginForm } from "../ui/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <ContainerForm>
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Welcome back! 👋
        </h1>
        <LoginForm />

        <div className="text-center mt-6">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline hover:text-white/80">
              Sign up
            </Link>
          </p>
        </div>
      </ContainerForm>
    </div>
  );
}
