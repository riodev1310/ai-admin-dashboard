import { api } from "@/lib/api";
import type { LoginInput, User } from "@/lib/auth/types";
import { TEST_PASSWORD, TEST_USER } from "@/lib/auth/mock";

const ENABLE_TEST_BYPASS =
  (process.env.NEXT_PUBLIC_ENABLE_TEST_BYPASS ?? "true") === "true";

/**
 * Login:
 * - Ưu tiên gọi backend /auth/login (JWT) nếu tồn tại
 * - Nếu backend chưa implement, có thể dùng bypass test user.
 */
export async function login(input: LoginInput): Promise<{
  token: string;
  user: User;
  isBypass?: boolean;
}> {
  if (
    ENABLE_TEST_BYPASS &&
    input.email.trim().toLowerCase() === TEST_USER.email &&
    input.password === TEST_PASSWORD
  ) {
    // Fake JWT-like token (không cần verify), để demo UI.
    const token = btoa(
      JSON.stringify({ sub: TEST_USER.id, email: TEST_USER.email, role: "admin" })
    );
    return { token, user: TEST_USER, isBypass: true };
  }

  // Backend suggestion: POST /auth/login {email, password} -> {access_token, user}
  const res = await api.post("/auth/login", input);
  const token = res.data?.access_token as string;
  const user = res.data?.user as User;
  if (!token || !user) {
    throw new Error("Phản hồi login không hợp lệ từ backend");
  }
  return { token, user };
}

export async function fetchMe(): Promise<User> {
  // Backend suggestion: GET /auth/me
  const res = await api.get("/auth/me");
  return res.data as User;
}
