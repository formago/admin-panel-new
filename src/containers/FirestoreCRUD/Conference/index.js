import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../../redux/conferences/actions';
import { Textarea } from '../../../components/uielements/input';
import Select, {
  SelectOption as Option,
} from '../../../components/uielements/select';

import { Input } from 'antd';
import Form from '../../../components/uielements/form';
import Checkbox from '../../../components/uielements/checkbox';
import Button from '../../../components/uielements/button';
import Notification from '../../../components/notification';

// import Modal from 'components/feedback/modal';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper.js';
import Box from '../../../components/utility/box';
import ContentHolder from '../../../components/utility/contentHolder';
import Popconfirms from '../../../components/feedback/popconfirm';
import fakeData from './models/types';


import FormValidation from '../../../components/conference'
import {
  ActionBtn,
  Fieldset,
  // Form,
  Label,
  TitleWrapper,
  ButtonHolders,
  ActionWrapper,
  ComponentTitle,
  TableWrapper,
  StatusTag,
} from './conferences.style';
import clone from 'clone';

const FormItem = Form.Item;


const fakeDataList = new fakeData(5).getAll();

class Conferences extends Component {
  componentDidMount() {
    this.props.loadFromFireStore();
  }
  handleRecord = (actionName, conference) => {
    if (conference.key && actionName !== 'delete') actionName = 'update';
    this.props.saveIntoFireStore(conference, actionName);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Notification(
          'success',
          'Received values of form',
          JSON.stringify(values)
        );
      }
    });
  };

  resetRecords = () => {
    this.props.resetFireStoreDocuments();
  };

  handleModal = (conference = null) => {
    this.props.toggleModal(conference);
  };

  onRecordChange = (key, event) => {
    let { conference } = clone(this.props);
    if (key) conference[key] = event.target.value;
    this.props.update(conference);
  };

  onSelectChange = (key, value) => {
    let { conference } = clone(this.props);
    if (key) conference[key] = value;
    this.props.update(conference);
  };

  render() {
    const { modalActive, conferences } = this.props;
    const { conference } = clone(this.props);
    const dataSource = [];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    const listItems = fakeDataList.map((type) =>
      <Option key={type.key} value={type.title}>{type.title}</Option>
    );

    Object.keys(conferences).map((conference, index) => {
      return dataSource.push({
        ...conferences[conference],
        key: conference,
      });
    });

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => { },
    };

    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: '200px',
        sorter: (a, b) => {
          if (a.title < b.title) return -1;
          if (a.title > b.title) return 1;
          return 0;
        },
        render: (text, row) => {
          const trimByWord = sentence => {
            let result = sentence;
            let resultArray = result.split(' ');
            if (resultArray.length > 7) {
              resultArray = resultArray.slice(0, 7);
              result = resultArray.join(' ') + '...';
            }
            return result;
          };

          return trimByWord(row.title);
        },
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '360px',
        sorter: (a, b) => {
          if (a.description < b.description) return -1;
          if (a.description > b.description) return 1;
          return 0;
        },
        render: (text, row) => {
          const trimByWord = sentence => {
            let result = sentence;
            let resultArray = result.split(' ');
            if (resultArray.length > 20) {
              resultArray = resultArray.slice(0, 20);
              result = resultArray.join(' ') + '...';
            }
            return result;
          };

          return trimByWord(row.description);
        },
      },
      {
        title: 'Excerpt',
        dataIndex: 'excerpt',
        key: 'excerpt',
        width: '220px',
        sorter: (a, b) => {
          if (a.excerpt < b.excerpt) return -1;
          if (a.excerpt > b.excerpt) return 1;
          return 0;
        },
        render: (text, row) => {
          const trimByWord = sentence => {
            let result = sentence;
            let resultArray = result.split(' ');
            if (resultArray.length > 8) {
              resultArray = resultArray.slice(0, 8);
              result = resultArray.join(' ') + '...';
            }
            return result;
          };

          return trimByWord(row.excerpt);
        },
      },
      {
        title: 'Slugs',
        dataIndex: 'slug',
        width: '170px',
        key: 'slug',
        sorter: (a, b) => {
          if (a.slug < b.slug) return -1;
          if (a.slug > b.slug) return 1;
          return 0;
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        className: 'noWrapCell',
        key: 'status',
        sorter: (a, b) => {
          if (a.status < b.status) return -1;
          if (a.status > b.status) return 1;
          return 0;
        },

        render: (text, row) => {
          let className;
          if (row.status === ('draft' || 'Draft' || 'DRAFT')) {
            className = 'draft';
          } else if (row.status === ('publish' || 'Publish' || 'PUBLISH')) {
            className = 'publish';
          }
          return <StatusTag className={className}>{row.status}</StatusTag>;
        },
      },
      {
        title: 'Actions',
        key: 'action',
        width: '60px',
        className: 'noWrapCell',
        render: (text, row) => {
          return (
            <ActionWrapper>
              <a onClick={this.handleModal.bind(this, row)}>
                <i className="ion-android-create" />
              </a>

              <Popconfirms
                title="Are you sure to delete this conference？"
                okText="Yes"
                cancelText="No"
                placement="topRight"
                onConfirm={this.handleRecord.bind(this, 'delete', row)}
              >
                <a className="deleteBtn">
                  <i className="ion-android-delete" />
                </a>
              </Popconfirms>
            </ActionWrapper>
          );
        },
      },
    ];

    return (
      <LayoutContentWrapper>

        <Box style={!modalActive ? { display: "none" } : { display: "block" }}>
          <ContentHolder style={{ marginTop: 0, overflow: 'hidden' }}>
            <FormValidation />
            {/* <Form onSubmit={this.handleSubmit}>
              <Fieldset>
                <Label>Title</Label>
                <Input
                  label="Title"
                  placeholder="Enter Title"
                  value={conference.title}
                  onChange={this.onRecordChange.bind(this, 'title')}
                />
              </Fieldset>

              <Fieldset>
                <Label>Description</Label>
                <Textarea
                  label="Description"
                  placeholder="Enter Description"
                  rows={5}
                  value={conference.description}
                  onChange={this.onRecordChange.bind(this, 'description')}
                />
              </Fieldset>

              <Fieldset>
                <Label>Excerpt</Label>
                <Textarea
                  label="Excerpt"
                  rows={5}
                  placeholder="Enter excerpt"
                  value={conference.excerpt}
                  onChange={this.onRecordChange.bind(this, 'excerpt')}
                />
              </Fieldset>

              <Fieldset>
                <Label>Slug</Label>

                <Input
                  label="Slug"
                  placeholder="Enter Slugs"
                  value={conference.slug}
                  onChange={this.onRecordChange.bind(this, 'slug')}
                />
              </Fieldset>

              <Fieldset>
                <Label>Status</Label>
                <Select
                  defaultValue={conference.status}
                  placeholder="Enter Status"
                  onChange={this.onSelectChange.bind(this, 'status')}
                  style={{ width: '170px' }}
                >
                  {listItems}
                </Select>
              </Fieldset>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Register
          </Button>
              </FormItem>
            </Form> */}

          </ContentHolder>
        </Box>
        <Box style={modalActive ? { display: "none" } : { display: "block" }}>
          <ContentHolder style={{ marginTop: 0, overflow: 'hidden' }}>
            <TitleWrapper>
              <ComponentTitle>Conferences</ComponentTitle>

              <ButtonHolders>
                <ActionBtn type="danger" onClick={this.resetRecords}>
                  Reset record
                </ActionBtn>

                <ActionBtn
                  type="primary"
                  onClick={this.handleModal.bind(this, null)}
                >
                  Add new record
                </ActionBtn>
              </ButtonHolders>
            </TitleWrapper>


            <TableWrapper
              rowKey="key"
              size="2"
              rowSelection={rowSelection}
              columns={columns}
              bordered={true}
              dataSource={dataSource}
              loading={this.props.isLoading}
              className="isoSimpleTable"
              pagination={{
                // defaultPageSize: 1,
                hideOnSinglePage: true,
                total: dataSource.length,
                showTotal: (total, range) => {
                  return `Showing ${range[0]}-${range[1]} of ${
                    dataSource.length
                    } Results`;
                },
              }}
            />
          </ContentHolder>
        </Box>
      </LayoutContentWrapper>
    );
  }
}

export default connect(
  state => ({
    ...state.Conferences,
  }),
  actions
)(Conferences);
