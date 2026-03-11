"use client";

import React from "react";
import { Button, Card, Form, Input, Space, Typography, message } from "antd";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/lib/auth/store";
import { env } from "@/lib/env";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const token = useAuthStore((s) => s.token);

  return (
    <div className="space-y-4">
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Cài đặt
        </Typography.Title>
        <Typography.Text type="secondary">
          User profile và API keys (client-side demo).
        </Typography.Text>
      </div>

      <Card>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          User
        </Typography.Title>

        <Form
          layout="vertical"
          initialValues={{
            name: user?.name ?? "Demo Admin",
            email: user?.email ?? "admin@demo.local"
          }}
          onFinish={(v) => {
            // demo update local store only
            setSession({
              token: token ?? "demo",
              user: {
                id: user?.id ?? "u_test_admin",
                role: user?.role ?? "admin",
                name: v.name,
                email: v.email
              }
            });
            message.success("Đã cập nhật profile (local demo)");
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Card>

      <Card>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          API Keys
        </Typography.Title>
        <Typography.Paragraph className="opacity-80">
          Demo: lưu key ở localStorage. Với production, nên lưu ở backend hoặc secret manager.
        </Typography.Paragraph>

        <Form
          layout="vertical"
          initialValues={{
            apiBaseUrl: env.API_BASE_URL,
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
            supabaseAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
          }}
          onFinish={(v) => {
            localStorage.setItem("sbiz_api_base_url", v.apiBaseUrl);
            localStorage.setItem("sbiz_supabase_url", v.supabaseUrl);
            localStorage.setItem("sbiz_supabase_anon", v.supabaseAnon);
            message.success("Đã lưu keys (local demo). Reload trang để áp dụng.");
          }}
        >
          <Form.Item
            label="API Base URL"
            name="apiBaseUrl"
            rules={[{ required: true }]}
          >
            <Input prefix={<KeyOutlined />} placeholder="http://localhost:8000" />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Form.Item label="Supabase URL" name="supabaseUrl">
              <Input placeholder="https://xxxx.supabase.co" />
            </Form.Item>
            <Form.Item label="Supabase Anon Key" name="supabaseAnon">
              <Input.Password placeholder="eyJhbGci..." />
            </Form.Item>
          </div>

          <Space>
            <Button type="primary" htmlType="submit">
              Save keys
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("sbiz_api_base_url");
                localStorage.removeItem("sbiz_supabase_url");
                localStorage.removeItem("sbiz_supabase_anon");
                message.info("Đã xoá keys (local).");
              }}
            >
              Clear
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
