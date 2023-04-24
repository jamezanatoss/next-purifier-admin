import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export default function Register() {
    const { register, handleSubmit } = useForm();
    const router = useRouter();
  
    const onSubmit = async (data) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        router.push("/login");
      }
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name:
          <input {...register("name")} />
        </label>
        <label>
          Email:
          <input {...register("email")} />
        </label>
        <label>
          Password:
          <input {...register("password")} />
        </label>
        <button type="submit">Register</button>
      </form>
    );
  }