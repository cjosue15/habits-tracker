"use client";
import Card from "@/components/Card/Card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleAuthProvider } from "./GoogleAuthProvider";
import { Button } from "@/components/Button/Button";
import { EmailIcon } from "@/components/icons/email";
import { Error, Input, Label } from "@/components/Input";
import { RocketIcon } from "@/components/icons";

export const SignupForm = () => {
  const [signUpWithEmail, setSignUpWithEmail] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data: any) => console.log(data);
  return (
    <Card>
      <GoogleAuthProvider text="Sign up" />

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
