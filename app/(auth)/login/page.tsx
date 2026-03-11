"use client";

import React from "react";
import { Button, Card, Form, Input, Typography, Alert } from "antd";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth/service";
import { useAuthStore } from "@/lib/auth/store";
import { authApi } from "@/lib/apiClients";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <div className="mb-4">
          <Title level={3} style={{ marginBottom: 0 }}>
            Đăng nhập
          </Title>
          <Text type="secondary">
            Demo bypass: <b>admin@demo.local</b> / <b>Admin@123</b>
          </Text>
        </div>

        {error ? (
          <Alert className="mb-3" type="error" title={error} showIcon />
        ) : null}
        {info ? (
          <Alert className="mb-3" type="info" title={info} showIcon />
        ) : null}

        <Form
          layout="vertical"
          onFinish={async (values) => {
            setError(null);
            setInfo(null);
            setLoading(true);
            try {
              const res = await login(values);
              setSession({ token: res.token, user: res.user });
              if (res.isBypass) {
                setInfo("Đã login bằng test user (bypass).");
              }
              router.replace("/dashboard");
            } catch (e: any) {
              setError(e?.message ?? "Không thể đăng nhập");
            } finally {
              setLoading(false);
            }
          }}
          initialValues={{ email: "admin@demo.local", password: "Admin@123" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Nhập email" },
              { type: "email", message: "Email không hợp lệ" }
            ]}
          >
            <Input placeholder="you@company.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Nhập mật khẩu" }]}
          >
            <Input.Password placeholder="••••••••" autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>

          <div className="mt-3 text-xs opacity-80">
            <div>
              <b>JWT lưu trong localStorage</b>. Để production, cân nhắc httpOnly cookie.
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}
