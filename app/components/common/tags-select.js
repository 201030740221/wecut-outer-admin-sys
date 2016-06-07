import {Select} from 'antd';
const Option = Select.Option;

var TagsSelect = React.createClass({
    getInitialState: function () {
        return {
         tagList:[],
         defaultValue: '1'
        };
    },
    componentDidMount: function () {
      let self = this;
      let _parmas = {};

      if(localStorage.getItem('adminId')){
        _parmas.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/taglist.php',
        method: 'post',
        data: _parmas,
        type: 'json',
        success: (res) => {
          if(res.code){
            self.setState({
              tagList: res.data
            })
          }else{
             message.error(result.msg);
          }

        }
      });

      this.setState({
        defaultValue: this.props.defaultValue
      })

    },
    componentWillReceiveProps(nextProps) {
      this.setState({
        defaultValue: nextProps.defaultValue
      })
    },
    tagChange(value){
      if(this.props.tagChange){
        this.props.tagChange(value);
        this.setState({
          defaultValue: value
        })
      }

    },
    render(){

      let self = this;
      let tagList = this.state.tagList;
      let defaultValue = this.state.defaultValue;

      return (
          <div>
            <Select
               showSearch
               id="tagid"
               value={defaultValue}
               placeholder=""
               style={{ width: '100%' }}
               onChange={self.tagChange}
               >
              {
                tagList.map((_item,_key)=>{
                  return(
                    <Option value={_item.tagid} key={_item.name+":"+_item.tagid}>{_item.name}</Option>
                  )
                })
              }
            </Select>
          </div>
        )
    }
})

module.exports = TagsSelect;
