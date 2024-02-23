"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Error, Input, Label } from "@/components/Input";
import { Button } from "@/components/Button/Button";
import { ArrowRightIcon } from "@/components/icons";
import Card from "@/components/Card/Card";
import { notify } from "@/shared/notify";
import { GoogleAuthProvider } from "./GoogleAuthProvider";

const ACCESS_DENIED = "AccessDenied";
const GOOGLE_SUCCESS = "google";

type FormValues = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>();

  const searchParams = useSearchParams();

  useEffect(() => {
    let message = "";
    let type: "success" | "error" = "success";

    if (searchParams.get("error") === ACCESS_DENIED) {
      message = "Oops! Something went wrong";
      type = "error";
    }

    if (searchParams.get("success") === GOOGLE_SUCCESS) {
      message = "Welcome! 👋";
      type = "success";
      router.push("/my-habits");
    }

    if (message && type) {
      setTimeout(() => {
        notify(message, type);
      });
    }
  }, [searchParams, router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/my-habits",
      });

      if (response?.ok) {
        notify("Welcome back! 👋", "success");
        router.push("/my-habits");
      } else {
        notify("Invalid email or password", "error");
      }
    } catch (error: any) {
      notify(error.message, "error");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/auth/login?success=google",
        redirect: false,
      });
    } catch (error) {
      notify("Oops! Something went wrong", "error");
    }
  };

  return (
    <Card>
      <GoogleAuthProvider text="Sign In" onClick={handleGoogleAuth} />

      <div className="grid grid-cols-[1fr,30px,1fr] gap-x-4 items-center my-6">
        <hr className="border-white/30" />
        <b>OR</b>
        <hr className="border-white/30" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6">
          <Label htmlFor="email" error={!!errors.email}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            error={!!errors.email}
            {...register("email", {
              required: {
                value: true,
                message: "The email is required",
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "The email is invalid",
              },
            })}
          />

          <Error error={!!errors.email}>
            {errors.email?.message as String}
          </Error>
        </div>

        <div className="mt-6 mb-6">
          <Label htmlFor="password" error={!!errors.password}>
            Password
          </Label>
          <Input
            id="password"
            type="password"
            error={!!errors.password}
            {...register("password", {
              required: {
                value: true,
                message: "The password is required",
              },
              minLength: {
                value: 6,
                message: "The password must be at least 6 characters long",
              },
            })}
          />

          <Error error={!!errors.password}>
            {errors.password?.message as String}
          </Error>
        </div>
        <Button
          type="submit"
          className="flex justify-center gap-x-2 items-center hover:!bg-green-500 !bg-green-600 !text-white"
        >
          Sign In <ArrowRightIcon />
        </Button>
      </form>
    </Card>
  );
};
