"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createUser } from "@/utils/localStorage";
import Link from "next/link";

type FormValues = {
  email: string;
  password: string;
};

export default function SignUpPage() {
  const { register, handleSubmit } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit = (data: FormValues) => {
    const success = createUser(data);
    if (!success) {
      alert("User with this email already exists!");
      return;
    }
    alert("Account created! Please login.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
