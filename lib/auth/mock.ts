/**
 * Demo "test user" để bypass login theo yêu cầu.
 * Bạn có thể đổi / tắt chế độ này bằng cách set NEXT_PUBLIC_ENABLE_TEST_BYPASS=false.
 */
import type { User } from "@/lib/auth/types";

export const TEST_USER = {
  id: "u_test_admin",
  email: "admin@demo.local",
  name: "Demo Admin",
  role: "admin"
} satisfies User;

export const TEST_PASSWORD = "Admin@123";
