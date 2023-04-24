import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export default function Login() {
    // const [showNav, setShowNav] = useState(false);
    // const { data: session } = useSession();
    const { register, handleSubmit } = useForm();
    const router = useRouter();

    const onSubmit = async (data) => {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem("token", token);
            router.push("/");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                Email:
                <input {...register("email")} />
            </label>
            <label>
                Password:
                <input {...register("password")} />
            </label>
            <button type="submit">Login</button>
        </form>
    );

    
}