"use client";
import { PracticeTable } from "@/components/Table";
import useAuthStore from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const { isAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("user")){
            router.push("/login");
        }
    }
    , [isAuth]);

    return (
        <div className="p-4">
            <PracticeTable />
        </div>
    );
}

export default Page;