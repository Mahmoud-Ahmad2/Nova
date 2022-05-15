import {
  Table, Space, Button, message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './UpcomingInterviews.css';
import PropTypes from 'prop-types';

const { Column } = Table;
const UpcomingInterviews = ({ status }) => {
  const { user } = useSelector((state) => state.auth);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);

  const cancelInterview = async (id) => {
    try {
      await axios.delete(`/api/interview/${id}`);
      setDataSource((prev) => prev.filter((item) => item.key !== id));
    } catch (error) {
      message.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users/interview?status=upcoming&&page=${page}`);
        let nameData;
        if (user.data.role) {
          const { data: { data: { name } } } = (user.data.role === 'interviewee') ? await axios.get(`/api/user/info/${data.data[0].interviews.interviewerId}`)
            : await axios.get(`/api/user/info/${data.data[0].interviews.intervieweeId}`);
          nameData = name;
        }
        data.data.forEach((obj) => {
          const date = new Date(obj.interviews.date);
          const dateStr = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
          setDataSource([{
            // eslint-disable-next-line no-underscore-dangle
            key: obj.interviews._id,
            Name: nameData,
            questionCategory: obj.interviews.questionCategory,
            language: obj.interviews.language,
            specialization: obj.interviews.specialization,
            date: dateStr,
            time: obj.interviews.time,
          },
          ]);
        });
      } catch (error) {
        setDataSource([]);
        message.error(error);
      }
    };
    fetchData();
  }, [user, page]);

  return (
    <Table
      dataSource={dataSource}
      pagination={{
        current: page,
        pageSize: 3,
        total: 50,
        onChange: (pageCh) => {
          setPage(pageCh);
        },
      }}
    >
      {user.data.role === 'interviewee' ? (
        <Column
          title="Interviewer Name"
          dataIndex="Name"
          key="Name"
        />
      )
        : <Column title="Interviewee Name" dataIndex="Name" key="Name" />}
      <Column title="Question category" dataIndex="questionCategory" key="questionCategory" />
      <Column title="Language" dataIndex="language" key="language" />
      <Column title="Specialization" dataIndex="specialization" key="specialization" />
      <Column title="Date" dataIndex="date" key="date" />
      <Column title="Time" dataIndex="time" key="time" />
      {(status === 'upcoming') ? (
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Button type="primary" key={record.key} danger>
                Cancel Interview
              </Button>
            </Space>
          )}
        />
      ) : (
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Button onClick={() => cancelInterview(record.key)} type="primary" key={record.key} danger>
                Delete Interview
              </Button>
            </Space>
          )}
        />
      )}
    </Table>
  );
};

UpcomingInterviews.propTypes = {
  status: PropTypes.string.isRequired,
};

export default UpcomingInterviews;
