"use server";

import { cookies } from "next/headers";
import {
  createAdminClient,
  createSessionClient,
} from "@/backend-services/config";
import facultyServerServices from "@/backend-services/Faculty-server";
import studentServerServices from "@/backend-services/Student-server";
import CryptoJS from "crypto-js";
import { Client } from "ldapts";

const ADMIN_EMAILS = [
  "superprojectadmin@sot.pdpu.ac.in",
  "minorprojectadmin@pdpu.ac.in",
  "dev@pdpu.ac.in",
  "test.student@sot.pdpu.ac.in",
  "test.student2@sot.pdpu.ac.in",
  "test.student3@sot.pdpu.ac.in",
  "test.student4@sot.pdpu.ac.in",
  "test.student5@sot.pdpu.ac.in",
  "test.faculty@sot.pdpu.ac.in",
  "test.faculty2@sot.pdpu.ac.in",
  "test.faculty3@sot.pdpu.ac.in",
  "test.faculty4@sot.pdpu.ac.in",
  "test.faculty5@sot.pdpu.ac.in",
  "darshit.shah@spt.pdpu.ac.in",
];

// LDAP Authentication function
async function authenticateWithLDAP(email: string, password: string) {
  const ldapUrl = process.env.LDAP_URL || "ldap://pdpu.ac.in";
  const searchBase = process.env.LDAP_SEARCH_BASE || "dc=pdpu,dc=ac,dc=in";
  const bindDN = email;

  const client = new Client({ url: ldapUrl });

  try {
    await client.bind(bindDN, password);

    let userMail;

    const { searchEntries } = await client.search(searchBase, {
      scope: "sub",
      filter: `(userPrincipalName=${bindDN})`,
      attributes: ["mail"],
    });

    if (searchEntries.length > 0 && searchEntries[0].mail) {
      userMail = searchEntries[0].mail;
    } else {
      return {
        success: false,
        error: "Email attribute not found for the user",
      };
    }

    return {
      success: true,
      user: { mail: String(userMail) },
    };
  } catch (error) {
    try {
      await client.unbind();
    } catch { }
    return { success: false, error: "LDAP authentication failed" };
  } finally {
    await client.unbind();
  }
}

// Function to normalize email
function normalizeEmail(email: string): string {
  if (!email.includes("@")) {
    return `${email}@pdpu.ac.in`;
  }
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  if (domain.includes("pdpu.ac.in")) {
    return `${localPart}@pdpu.ac.in`;
  }
  return email;
}

// Server action for login
export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  try {
    const { email } = formData;
    let { password } = formData;

    //Decrypt password using NEXT_PUBLIC_SECRET_KEY
    try {
      password = CryptoJS.AES.decrypt(
        password,
        String(process.env.NEXT_PUBLIC_SECRET_KEY)
      ).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      return { success: false, error: "Password decryption failed" };
    }

    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return { success: false, error: "Invalid input format" };
    }

    const isAdminEmail = ADMIN_EMAILS.includes(email);
    let normalizedEmail = isAdminEmail ? email : normalizeEmail(email);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
    if (!emailRegex.test(normalizedEmail) && !usernameRegex.test(email)) {
      return { success: false, error: "Invalid email or username format" };
    }

    if (!normalizedEmail.includes("@")) {
      normalizedEmail = normalizeEmail(email);
    }

    let userEmail: string;
    let userPassword: string;

    if (isAdminEmail) {
      userEmail = normalizedEmail;
      userPassword = password;
    } else {
      const ldapResult = await authenticateWithLDAP(normalizedEmail, password);

      if (!ldapResult.success) {
        return { success: false, error: "Invalid email or password" };
      }

      if (!ldapResult.user || !ldapResult.user.mail) {
        return { success: false, error: "User not found in LDAP" };
      }

      userEmail = ldapResult.user.mail;

      let user: { password: string } | null = null;
      user = await facultyServerServices.getFacultyPasswordByEmailId(userEmail);
      if (!user) {
        user = await studentServerServices.getStudentPasswordByEmailId(
          userEmail
        );
      }
      if (!user) {
        return { success: false, error: "User not found in the system" };
      }


      try {
        userPassword = CryptoJS.AES.decrypt(
          user.password,
          String(process.env.NEXT_PUBLIC_SECRET_KEY)
        ).toString(CryptoJS.enc.Utf8);
      } catch (decryptError) {
        return { success: false, error: "Password decryption failed" };
      }
    }
    console.log("User Password:", userPassword);

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(
      userEmail,
      userPassword
    );
    console.log("Session created:", session);

    const isProduction = String(process.env.NODE_ENV) === "production";
    const cookieStore = await cookies();
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: isProduction,
      expires: new Date(session.expire),
      path: "/",
    });

    // Use the session secret to create a user session client
    const { account: userAccount } = await createSessionClient(session.secret);


    // Get user info from account using the user session
    const user = await userAccount.get();
    console.log("User info retrieved:", user);
    let facultyData = null;
    let studentData = null;

    // Use the first label as the type ("Faculty" or "Student")
    const userType = user.labels && user.labels.length > 0 ? user.labels[0] : null;

    if (userType === "Faculty" && user.$id) {
      facultyData = await facultyServerServices.getFacultyById(user.$id);
    } else if (userType === "Student" && user.$id) {
      studentData = await studentServerServices.getStudentById(user.$id);
    }

    let userData;

    if (userType && ["Admin", "SuperAdmin", "Developer"].includes(userType)) {
      userData = {
        userId: user.$id,
        name: user.name,
        email: user.email,
        type: userType,
        labels: user.labels || [],
        facultyData: null,
        studentData: null,
      };
    } else if (userType === "Faculty") {
      userData = {
        userId: user.$id,
        name: user.name,
        email: user.email,
        type: userType,
        labels: user.labels || [],
        isHOD: user.labels.includes("CSHOD"),
        facultyData,
        studentData: null,
      };
    } else if (userType === "Student") {
      userData = {
        userId: user.$id,
        name: user.name,
        email: user.email,
        type: userType,
        labels: user.labels || [],
        facultyData: null,
        studentData,
      };
    } else {
      userData = null;
    }

    return {
      success: true,
      message: "Login successful",
      user: userData,
    };
  } catch (error: any) {
    if (error.code === 401 || error.type === "user_invalid_credentials") {
      return {
        success: false,
        error:
          "Invalid Credentials or System Configurations . Please contact support if you continue to experience issues.",
      };
    }
    if (error.code === 429) {
      return {
        success: false,
        error: "Too many login attempts. Please try again later.",
      };
    }
    return {
      success: false,
      error: "An error occurred during login. Please try again.",
    };
  }
}

// Server action for logout
export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie?.value) {
      try {
        const { account } = await createSessionClient(sessionCookie.value);
        await account.deleteSession("current");
      } catch (error) {
        // Continue with cookie deletion even if session deletion fails
      }
    }

    cookieStore.delete("session");

    return {
      success: true,
      message: "Logout successful",
      redirectUrl: "/login",
    };
  } catch (error) {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return {
      success: true,
      message: "Logout completed",
      redirectUrl: "/login",
    };
  }
}