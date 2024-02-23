"use client";
import Card from "@/components/Card/Card";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { GoogleAuthProvider } from "./GoogleAuthProvider";
import { Button } from "@/components/Button/Button";
import { EmailIcon } from "@/components/icons/email";
import { Error, Input, Label } from "@/components/Input";
import { RocketIcon } from "@/components/icons";
import { notify } from "@/shared/notify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export const SignupForm = () => {
  const [signUpWithEmail, setSignUpWithEmail] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/my-habits");
        notify("Welcome! 👋", "success");
      } else {
        notify("Oops! Something went wrong", "error");
      }
    } catch (error: any) {
      notify(error.message, "error");
    }
  };

  const handleGoogleAuth = async () => {
    await signIn("google", {
      callbackUrl: "/auth/login?success=google",
    });
  };

  return (
    <Card>
      <GoogleAuthProvider text="Sign up" onClick={handleGoogleAuth} />

      <div className="grid grid-cols-[1fr,30px,1fr] gap-x-4 items-center my-6">
        <hr className="border-white/30" />
        <b>OR</b>
        <hr className="border-white/30" />
      </div>
      {!signUpWithEmail && (
        <Button
          className="flex justify-center items-center gap-x-4 !bg-green-600 !text-white"
          onClick={() => setSignUpWithEmail(true)}
        >
          <EmailIcon /> Sign up with email
        </Button>
      )}
      {signUpWithEmail && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name" error={!!errors.name}>
              Name
            </Label>
            <Input
              id="name"
              type="text"
              error={!!errors.name}
              {...register("name", {
                required: {
                  value: true,
                  message: "The name is required",
                },
              })}
            />

            <Error error={!!errors.name}>
              {errors.name?.message as String}
            </Error>
          </div>

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
                  message: "invalid email address",
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
                  message: "Min length is 6",
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
            Sign Up <RocketIcon />
          </Button>
        </form>
      )}
    </Card>
  );
};
