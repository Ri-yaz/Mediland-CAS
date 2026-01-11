import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <SignIn />
      <div className="text-sm text-gray-600 mt-2">
        Are you a doctor?{" "}
        <Link href="/register-doctor" className="text-blue-700 font-semibold hover:underline">
          Register here for approval
        </Link>
      </div>
    </div>
  );
}
