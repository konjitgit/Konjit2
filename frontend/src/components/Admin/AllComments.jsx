import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { useState } from "react";

const AllComments = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/comment/admin-all-comments`, { withCredentials: true })
      .then((res) => {
        setData(res.data.comments);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "firstName",
      headerName: "First Name",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 100,
      flex: 0.8,
    },

    {
      field: "comment",
      headerName: "Comment",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
  
  ];

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        comment: item.comment,
    });
    });

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-beige">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </>
  );
};

export default AllComments;
