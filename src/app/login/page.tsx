"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authenticateUser } from "@/utils/localStorage";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormValues>();
  const router = useRouter();
  const { login } = useAuth();

  const onSubmit = (data: FormValues) => {
    const valid = authenticateUser(data.email, data.password);
    if (!valid) return alert("Invalid email or password");

    login({ email: data.email });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
