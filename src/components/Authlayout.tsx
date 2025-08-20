"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/GlobalRedux/hooks";
import { useRouter, usePathname } from "next/navigation";
import Loader from "./Loader";
import { userType } from "@/types";

function Authlayout({
  children,
  authentication = true,
  types,
  noRestriction = false,
}: {
  children: React.ReactNode;
  authentication: boolean;
  types: userType[];
  noRestriction?: boolean;
}) {
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);
  const [load, setLoad] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is logged in and tries to access auth pages
    if (status && authentication) {
      router.push("/");
    }
    // If user is not logged in and tries to access protected pages
    else if (!status && !authentication) {
      router.push(`/login`);
    }

    setLoad(false);
  }, [status, pathname, authentication, router]);

  return load ? (
    <Loader />
  ) : (user && !noRestriction && types.includes(user.type)) ||
    (noRestriction && types.includes("All")) ? (
    <div>{children}</div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Unauthorized Access</h1>
      <p className="text-lg">You are not authorized to access this page.</p>
      <p className="text-lg">Please login with the correct account.</p>
    </div>
  );
}

export default Authlayout;
