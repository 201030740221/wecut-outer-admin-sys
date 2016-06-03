import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { 
  Menu, Dropdown,Popover, message,DatePicker,
  Icon,Table, Tag, Form, Select, Upload,
  Input, Row, Col, Modal, Button,Pagination ,Transfer} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import BaseForm from '../../common/base-form';
import SelectTypeBox from '../../common/select-type-box';

var Uploader = React.createClass({
   getInitialState() {
    return {
      fileList: []
    };
  },
  handleChange(info) {

    let fileList = info.fileList;

    // 1. 上传列表数量的限制
    //    只显示最近上传的一个，旧的会被新的顶掉
    //fileList = fileList.slice(-2);
    console.log(fileList,'33');

    // 2. 读取远程路径并显示链接
    fileList = fileList.map((file) => {
      if (file.response) {
        let _response = file.response;
        // 组件会将 file.url 作为链接进行展示
        file.url = _response.data.picUrl;
        file.uid = _response.data.id;
        file.thumbUrl = _response.data.picUrl;
      }
      return file;
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
   /* fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });*/

    if(this.props.onUploaderChange){
      this.props.onUploaderChange(fileList);
    }

    this.setState({ fileList });
    
  },
  render() {

    let _adminId = '';
    if(localStorage.getItem('adminId')){
      _adminId = localStorage.getItem('adminId');
    }
    const props = {
      action: apiConfig.apiHost+'/cms/publish/upload.php',
      data: {adminId:_adminId},
      onChange: this.handleChange,
      multiple: true,
      listType: 'picture-card'
    };

    let fileList = this.state.fileList;
    return (
      <Row className="">
        <Col span="6">
          <Upload {...props} fileList={this.state.fileList}>
              <Icon type="plus" />
              <div className="ant-upload-text">上传照片</div>
          </Upload>
        </Col>
        <Col span="12">
        {
          fileList.map(function(item,key){
            return(
              <div className="" key={key}>
                <textarea id={"upload_dec"+key} type="textarea" className="upload_dec" placeholder="描述"></textarea>
              </div>
            )
          })
        } 
        </Col>
      
      </Row>
    );
  }
})

var LimitPublish = React.createClass({
   getInitialState() {
    return {

    };
  },
  onChange(value) {
    console.log('选择了时间：', value);
    if(this.props.onPublishTimeChange){
      this.props.onPublishTimeChange(value);
    }
  },

  render(){
    let self = this;
    return(
      <div>
        <span className="mt-5">
          <span>
            <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" onChange={self.onChange} />
          </span>
          <span className="u-ml-10 pr_top_5">推荐间隔</span>
          <span>
            <input id="instart" className="pr_top_5" type="text" placeholder="" style={{width:'50',padding:'3'}} />
          </span>
          <span className="u-ml-10 pr_top_5">到</span>
          <span>
            <input id="inend" className="pr_top_5" type="text" placeholder="" style={{width:'50',marginLeft:'10',padding:'3'}} />
          </span>
          <span className="pr_top_5">分钟发布</span>
        </span>
      </div>
    )
  }
})

var Index = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
    getInitialState: function () {
        return {
        	source: {},
        	loading: true,
          fileList: [],
          chids:[],
          tagids:[],
          channels: [],
          tags: [],
          usertaggroup: [],

          publish_type: 1,
          ptime: '',

        };
    },
    componentDidMount: function () {
       this.getFormData();
    },
    componentWillReceiveProps(nextprops){
      this.getFormData();
    },

    getFormData(){
       let self = this;

        let params = {};
       if(localStorage.getItem('adminId')){
          params.adminId = localStorage.getItem('adminId');
        }

       reqwest({
          url: apiConfig.apiHost+'/cms/publish/search.php',
          method: 'get',
          data: params,
          type: 'json',
          success: (result) => {

            let channels = result.data.channels;
            let tags = result.data.tags;
            let usertaggroup = result.data.usertaggroup;
            channels.forEach((item)=>{
              item.key = item.chid;
              item.value = item.name;
            })
            tags.forEach((item)=>{
              item.key = item.tagid;
              item.value = item.name;
            })
            usertaggroup.forEach((item)=>{
              item.key = item.usertagid;
              item.value = item.name;
            })

            self.setState({
              channels: channels,
              tags: tags,
              usertaggroup: usertaggroup
            })
          }
        });
    },

    onSelectChange(type,value){
      let self = this;
      console.log(value,'value',type);
      switch(type){
        case 'channel': 
              self.setState({ chids: value });
              break;
        case 'tags': 
              self.setState({ tagids: value });
              break;
      }
    },
    onSearchHandle(type,value){
      let self = this;
      console.log(value,'value',type);
       let params = {searchtext: value};
       if(localStorage.getItem('adminId')){
          params.adminId = localStorage.getItem('adminId');
        }

      reqwest({
          url: apiConfig.apiHost+'/cms/publish/searchchannel.php',
          method: 'get',
          data: params,
          type: 'json',
          success: (res) => {
            let channels = res.data.channels;
            channels.forEach((item)=>{
              item.key = item.chid;
              item.value = item.name;
            })
            console.log(channels);
            self.setState({
              channels: channels
              
            })
          }
        });
    },

    publishChange(val){
      console.log(val);
      this.setState({
        publish_type: val
      })
    },
    onPublishTimeChange(_time){
      this.setState({
        ptime: _time
      })
    },

    onUploaderChange(fileList){
      console.log(fileList,'66');
      this.setState({fileList});
    },

    render: function () {

    	let self = this;

      let publish_which = '';
      if(+this.state.publish_type==1){
        publish_which = {
            type: 'hidden',
            title: '定时发布',
            key: '',
            defaultValue: '',
        };
      }
      else if(+this.state.publish_type==2){
        publish_which = {
            title: '定时发布',
            key: '',
            defaultValue: '',
            placeholder: '',
            render(){
              return(
                  <LimitPublish onPublishTimeChange={self.onPublishTimeChange} />
                )
            }
          };
      }

      let data = [
      {
        title: '基本信息',
        formData: [
          {
            type: 'textarea',
            title: '内容主题',
            key: 'topic',
            defaultValue: '',
            placeholder: '',
            tips: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }
        ]
      }, {
        title: '发布信息',
        formData: [
          {
            type: "custom",
            title: '选择频道',
            key: 'chids',
            defaultValue: '',
            placeholder: '',
            tips: '＊若选择多个频道，则按照图片选择顺序，轮流发布到频道内',
            render(){
              return(
                  <SelectTypeBox 
                    type={'channels'}
                    data={self.state.channels} 
                    onSelectChange={self.onSelectChange.bind(null,'channel')} 
                    onSearchHandle={self.onSearchHandle.bind(null,'channel')}
                    />
                )
            }
          },
           {
            type: 'select',
            title: '选择发布用户',
            key: 'usertagid',
            defaultValue: '1',
            tips:'＊从我的发布账号中筛选，优先选择3天内无内容的用户',
            values: self.state.usertaggroup
          }, {
            type: "custom",
            title: '选择内容标签',
            key: 'tagids',
            defaultValue: '',
            placeholder: '',
            tips: '＊标签仅加在内容中',
            render(){
              return(
                  <SelectTypeBox 
                    type={'tags'}
                    data={self.state.tags} 
                    onSelectChange={self.onSelectChange.bind(null,'tags')} 
                    />
                )
            }
          },{
            type: 'radio',
            title: '发布时间',
            key: 'ptype',
            defaultValue: '1',
            values: [
              {
                name: '立即发布',
                key: '1',
                disabled: false
              },{
                name: '定时发布',
                key: '2',
                disabled: false
              }
            ],
            onChange: function(val){
                self.publishChange(val);
            }
          },publish_which
        ]
      }, {
        title: '发布内容',
        formData: [
          {
            title: '选择图片',
            key: 'ids',
            defaultValue: '',
            placeholder: '',
            tips: '＊最多同时选择10张，图片尺寸640*640',
            render(){
              return(
                  <Uploader onUploaderChange={self.onUploaderChange} />
                )
            }
          }
        ]
      }
    ];

    let actionButtons = [
      {
        title: '提 交',
        onClick: function (validator) {
          validator(function (isValid, validData) {
            console.log(validData);
            if (!isValid) {
              SP.message.error('填写有误！');
            } else {

              let fileList = self.state.fileList;
              let pics = [];
              fileList.forEach((item,key)=>{
                let _item = {};
                _item.id = +item.uid;
                _item.description = $('#upload_dec'+key).val();
                pics.push(_item);
              })
              
              let _parmas = {
                topic: validData[0].topic,
                chids: self.state.chids,
                tagids: self.state.tagids,
                usertagid: validData[1].usertagid,
                ptype: validData[1].ptype,
                ptime: self.state.ptime,
                instart: +$('#instart').val()||'',
                inend: +$('#inend').val()||'',
                images: pics
              }
              if(localStorage.getItem('adminId')){
                _parmas.adminId = localStorage.getItem('adminId');
              }
              console.log(_parmas,"_parmas");
              reqwest({
                url: apiConfig.apiHost+'/cms/publish/add.php',
                method: 'post',
                data: _parmas,
                type: 'json',
                success: (result) => {
                  if(result.code){
                     message.success('新增成功');
                     setTimeout(function(){ self.context.router.push('/publish/content/list'); } , 2000);
                  }else{
                     message.error(result.msg);
                  }
                 
                }
              });

            }
          });
          }
        }
      ];
      // 属性改变导致的二次渲染，其中radio，select类型的选中值不会随之改变
      return (<BaseForm data={data} actionButtons={actionButtons}/>);
    }
});

module.exports = Index;