"use client";

import React, { useMemo, useState } from "react";
import { Card, Col, Row, Segmented, Space, Statistic, Table, Typography, DatePicker, Switch, Button, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
// import { stockApi } from "@/lib/stockApi";
import { dataApi } from "@/lib/apiClients";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type StockData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  name: string;
};

type StockSummary = {
  symbol: string;
  name?: string;
  start?: string;
  end?: string;
  latest_date?: string;
  latest_close: number;
  change_pct: number;
  avg_volume: number;
  high: number;
  low: number;
  points: number;
};

export default function StockDataBrowser() {
  const { message } = App.useApp();

  const [symbol, setSymbol] = useState<string>("tsla");
  const [limit, setLimit] = useState<number>(365);
  const [showTable, setShowTable] = useState<boolean>(true);

  // optional filter dates
  const [range, setRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const start = range[0]?.format("YYYY-MM-DD");
  const end = range[1]?.format("YYYY-MM-DD");

  // 1) list symbols
  const symbolsQ = useQuery({
    queryKey: ["stock", "symbols"],
    queryFn: async () => {
      const res = await dataApi.get<string[]>("/stocks");
      return res.data;
    }
  });

  // 2) summary
  const summaryQ = useQuery({
    queryKey: ["stock", "summary", symbol, start, end, limit],
    queryFn: async () => {
      const res = await dataApi.get<StockSummary>(`/stocks/${symbol}/summary`, {
        params: { start, end, limit }
      });
      return res.data;
    },
    enabled: !!symbol
  });

  // 3) time series data
  const dataQ = useQuery({
    queryKey: ["stock", "data", symbol, start, end, limit],
    queryFn: async () => {
      const res = await dataApi.get<StockData[]>(`/stocks/${symbol}`, {
        params: { start, end, limit, order: "asc" }
      });
      return res.data;
    },
    enabled: !!symbol
  });

  const rows = dataQ.data || [];

  const chartData = useMemo(() => {
    return {
      labels: rows.map((r) => r.date),
      datasets: [
        {
          label: `${symbol.toUpperCase()} Close`,
          data: rows.map((r) => r.close)
        }
      ]
    };
  }, [rows, symbol]);

  const columns: ColumnsType<StockData> = [
    { title: "Date", dataIndex: "date", width: 120 },
    { title: "Open", dataIndex: "open", width: 120, render: (v) => Number(v).toFixed(2) },
    { title: "High", dataIndex: "high", width: 120, render: (v) => Number(v).toFixed(2) },
    { title: "Low", dataIndex: "low", width: 120, render: (v) => Number(v).toFixed(2) },
    { title: "Close", dataIndex: "close", width: 120, render: (v) => Number(v).toFixed(2) },
    { title: "Volume", dataIndex: "volume", width: 160, render: (v) => Number(v).toLocaleString() }
  ];

  const symbolOptions = symbolsQ.data?.map((s) => ({ label: s.toUpperCase(), value: s })) || [
    { label: "TSLA", value: "tsla" }
  ];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card style={{ borderRadius: 16 }}>
        <Space wrap style={{ justifyContent: "space-between", width: "100%" }} align="center">
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Stock Data Server
            </Typography.Title>
            <Typography.Text type="secondary">
              Dữ liệu OHLCV từ PostgreSQL theo từng symbol. Toggle để chuyển nhanh.
            </Typography.Text>
          </div>

          <Space wrap>
            {/* <Space>
              <Typography.Text>Show table</Typography.Text>
              <Switch checked={showTable} onChange={setShowTable} />
            </Space> */}

            <DatePicker.RangePicker
              allowEmpty={[true, true]}
              value={range}
              onChange={(v) => setRange([v?.[0] ?? null, v?.[1] ?? null])}
            />

            <Button
              onClick={() => {
                setRange([null, null]);
                setLimit(365);
                message.success("Reset filters");
              }}
              style={{ borderRadius: 12 }}
            >
              Reset
            </Button>
          </Space>
        </Space>

        <div style={{ marginTop: 12 }}>
          <Segmented
            options={symbolOptions}
            value={symbol}
            onChange={(v) => setSymbol(v as string)}
            block
          />
        </div>
      </Card>

      {/* <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <Card style={{ borderRadius: 16 }} loading={summaryQ.isLoading}>
            <Statistic title="Latest Close" value={summaryQ.data?.latest_close ?? 0} precision={2} />
            <Typography.Text type="secondary">
              {summaryQ.data?.latest_date ? `Date: ${summaryQ.data.latest_date}` : ""}
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card style={{ borderRadius: 16 }} loading={summaryQ.isLoading}>
            <Statistic title="Change %" value={summaryQ.data?.change_pct ?? 0} precision={2} suffix="%" />
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card style={{ borderRadius: 16 }} loading={summaryQ.isLoading}>
            <Statistic title="Avg Volume" value={summaryQ.data?.avg_volume ?? 0} />
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card style={{ borderRadius: 16 }} loading={summaryQ.isLoading}>
            <Statistic title="High / Low" value={`${(summaryQ.data?.high ?? 0).toFixed(2)} / ${(summaryQ.data?.low ?? 0).toFixed(2)}`} />
          </Card>
        </Col>
      </Row> */}

      {/* <Card style={{ borderRadius: 16 }} loading={dataQ.isLoading}>
        <Typography.Title level={5} style={{ marginTop: 0 }}>
          Price Chart (Close)
        </Typography.Title>

        <div style={{ height: 360 }}>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </Card> */}

      {showTable ? (
        <Card style={{ borderRadius: 16 }} loading={dataQ.isLoading}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            OHLCV Table
          </Typography.Title>

          <Table<StockData>
            rowKey={(r) => `${symbol}-${r.date}`}
            dataSource={rows}
            columns={columns}
            pagination={{ pageSize: 12 }}
            scroll={{ x: 900 }}
          />
        </Card>
      ) : null}
    </div>
  );
}