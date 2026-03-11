"use client";

import React from "react";
import { Row, Col, Button, message, Divider, Typography } from "antd";
import { UploadForm } from "@/components/data/UploadForm";
import { DataTable } from "@/components/data/DataTable";
import StockDataBrowser from "@/components/StockDataBrowser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function DataManagementPage() {
  const qc = useQueryClient();

  const augment = useMutation({
    mutationFn: async () => {
      const res = await api.post("/dag_augment");
      return res.data;
    },
    onSuccess: async () => {
      message.success("DAG augment started");
      await qc.invalidateQueries({ queryKey: ["structured-data"] });
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.detail || e?.message || "Augment failed");
    }
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* ✅ STOCK DATA SERVER SECTION */}
      <StockDataBrowser />

      <Divider />

      {/* <Typography.Title level={4} style={{ margin: 0 }}>
        Data Ingestion / Structured Data
      </Typography.Title> */}

      {/* <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <UploadForm
            onUploaded={() =>
              qc.invalidateQueries({ queryKey: ["structured-data"] })
            }
          />
        </Col>

        <Col xs={24} lg={12}>
          <DataTable rows={[]} />
          <div style={{ marginTop: 12 }}>
            <Button
              type="primary"
              onClick={() => augment.mutate()}
              loading={augment.isPending}
              style={{ borderRadius: 12 }}
            >
              Augment Data (DAG)
            </Button>
          </div>
        </Col>
      </Row> */}
    </div>
  );
}