import React, { useEffect, useState } from "react";
import { Button, Card, DatePicker, Form, Input, Table, Empty } from "antd";
import {
  http,
  printBankTransactions,
  downloadTransaction,
  trimData,
  formatDateV2,
} from "../../../modules/modules";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const { Item } = Form;

const TransactionTable = ({ query = {}, reloadKey = 0, showTable = true }) => {
  if (!showTable) return null;

  const token = cookies.get("authToken");
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const [accountNo, setAccountNo] = useState(query.accountNo || "");
  const [fullname, setFullname] = useState(query.fullname || "");
  const [branch, setBranch] = useState(query.branch || "");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (params = {}) => {
    setLoading(true);
    const searchParams = new URLSearchParams({
      page: params.current || 1,
      pageSize: params.pageSize || 10,
    });

    // Add filters from state OR initial query
    if (accountNo) searchParams.append("accountNo", accountNo);
    if (fullname) searchParams.append("fullname", fullname);
    if (branch) searchParams.append("branch", branch);
    try {
      const httpReq = http(token);
      const res = await httpReq.get(
        `/api/transaction/pagination?${searchParams.toString()}`
      );
      setData(res.data.data);
      console.log(res.data);

      setTotal(res.data.total);
      setPagination({
        current: res.data.page,
        pageSize: res.data.pageSize,
      });
      if (onDataLoaded) onDataLoaded(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      if (onDataLoaded) onDataLoaded([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchTransactions(pagination);
  // }, [query, reloadKey]); // Re-run when new props come in

  // const handleTableChange = (pagination) => {
  //   fetchTransactions(pagination);
  //   onFinish({
  //     fromDate: form.getFieldValue("fromDate"),
  //     toDate: form.getFieldValue("toDate"),
  //     accountNo: form.getFieldValue("accountNo"),
  //     fullname: form.getFieldValue("fullname"),
  //   });
  // };

  useEffect(() => {
    // Reset to page 1 whenever reloadKey or query changes
    setPagination((p) => ({ ...p, current: 1 }));
    fetchTransactions({ current: 1, pageSize: pagination.pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, reloadKey]);

  const handleTableChange = (newPagination) => {
    fetchTransactions(newPagination); // fetch table data for new page

    // Reapply filter values from form
    const values = {
      fromDate: form.getFieldValue("fromDate"),
      toDate: form.getFieldValue("toDate"),
      accountNo: form.getFieldValue("accountNo"),
      fullname: form.getFieldValue("fullname"),
    };

    onFinish(values);
  };

  const columns = [
    {
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Account Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Particular",
      dataIndex: "paxName",
      key: "paxName",
    },
    {
      title: "Passport",
      dataIndex: "paxNumber",
      key: "paxNumber",
    },
    {
      title: "Issue Date",
      dataIndex: "issueDate",
      key: "issueDate",
      render: (d) => formatDateV2(d),
    },
    {
      title: "Flight Date",
      dataIndex: "flightDate",
      key: "flightDate",
      render: (d) => formatDateV2(d),
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
    },
    {
      title: "AirCode",
      dataIndex: "airline",
      key: "airline",
    },
    {
      title: "PNR",
      dataIndex: "pnr",
      key: "pnr",
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: "Amount",
      dataIndex: "transactionAmount",
      key: "transactionAmount",
    },
    {
      title: "Total",
      dataIndex: "currentBalance",
      key: "currentBalance",
    },
  ];

  const onFinish = async (values) => {
    try {
      values.branch = query.branch;
      if (query.isCustomer) values.accountNo = query.accountNo;

      const httpReq = http(token);

      let body = {
        ...trimData(values),
        page: pagination.current,
        pageSize: pagination.pageSize,
      };

      const { data } = await httpReq.post(`/api/transaction/filter`, body);

      setData(data.data);
      setTotal(data.total);
      setPagination({
        current: data.page,
        pageSize: data.pageSize,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <Card className="!mb-2">
        <div className="flex justify-between items-center">
          <Form className="flex gap-3" onFinish={onFinish}>
            <Item label="From" name="fromDate" rules={[{ required: true }]}>
              <DatePicker />
            </Item>
            <Item label="To" name="toDate" rules={[{ required: true }]}>
              <DatePicker />
            </Item>
            {!query.isCustomer && (
              <Item label="Account No" name="accountNo">
                <Input placeholder="Account No" />
              </Item>
            )}
            {!query.isCustomer && (
              <Item label="Account Name" name="fullname">
                <Input placeholder="Account Name" />
              </Item>
            )}
            <Item>
              <Button
                type="text"
                htmlType="submit"
                className="!text-white !bg-blue-500 !font-semibold"
              >
                Fetch Transactions
              </Button>
            </Item>
          </Form>
          <div className="flex gap-3">
            <Button
              type="text"
              className="!text-white !bg-blue-500 !font-semibold"
              shape="circle"
              icon={<DownloadOutlined />}
              onClick={() => downloadTransaction(data)}
            />
            <Button
              type="text"
              className="!text-white !bg-blue-500 !font-semibold"
              shape="circle"
              icon={<PrinterOutlined />}
              onClick={() => printBankTransactions(data)}
            />
          </div>
        </div>
      </Card>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        pagination={{
          total: total,
          current: pagination.current,
          pageSize: pagination.pageSize,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default TransactionTable;
