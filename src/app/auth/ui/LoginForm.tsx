"use client";

import { useForm } from "react-hook-form";

import { Error, Input, Label } from "@/components/Input";
import { Button } from "@/components/Button/Button";
import { ArrowRightIcon } from "@/components/icons";
import Card from "@/components/Card/Card";
import { GoogleAuthProvider } from "./GoogleAuthProvider";

export const LoginForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data: any) => console.log(data);

  return (
    <Card>
      <GoogleAuthProvider text="Sign In" />

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
