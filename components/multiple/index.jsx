import React, {useState, useEffect, useRef, Fragment} from 'react';
import PropTypes from 'prop-types';
import '../../styles/Mutli.module.css';


/**
 * 使用：<SelectMultip data={list} width="500px" max={3} onClick={(val) => {}}/>
 * @param {*} data [{key: 3, value: '姓名'}]
 * @param {*} width
 * @param {*} onClick
 * @param {*} max 最多展示tag数量，多的用+n标识
 */
const SelectMultip = ({data, width, onClick, max = 10000}) => {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(data);
  const ulRef = useRef();
  const selectRef = useRef();
  const handleOpen = (e) => {
    setOpen(!open);
  };

  // 给父组件
  const getChecked = (list) => {
    const checkedList = list.filter(item => item.checked).map(item => item.key);
    onClick && onClick(checkedList);
  };

  const handleCheck = (i) => {
    const newArray = [...list];
    newArray[i].checked = !newArray[i].checked;
    setList(newArray);
    getChecked(newArray);
  };

  const handleClose = (key) => {
    const newArray = [...list];
    const target = newArray.find(item => item.key === key);
    target.checked = false;
    setList(newArray);
    getChecked(newArray);
  };

  // 监听window点击部分
  const handleWindow = (e) => {
    console.log(e,'==================',selectRef.current.contains(e.target))
    if (ulRef.current.contains(e.target) || selectRef.current.contains(e.target) || e.target.className === 'tag-close') {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    window.addEventListener('click', handleWindow, false);

    return () => {
      window.removeEventListener('click', handleWindow, false);
    };
  }, []);


  // 动态渲染节点部分
  const renderItem = ({key, value}) => {
    return <span className="tag" key={key} title={value}><span >{value}</span><i onClick={() => {handleClose(key);}} className="tag-close"></i></span>;
  };

  const checked = list.filter(item => item.checked);

  const renderMax = () => {
    const limit = checked.length > max;
    const list = limit ? checked.splice(0, max) : checked;
    return <Fragment>{list.map(item => renderItem(item))}{limit && checked.length > 0 && <span className="tag"><span >+{checked.length}</span></span>}</Fragment>;
  };

  return (
    // eslint-disable-next-line react/forbid-dom-props
    <div className="mutliDropdown" style={{width: width || '250px',height:'30px',background:'#ccc'}}>
      <div className="select" ref={selectRef}>
        {renderMax()}
        <i className={`select-right ${open ? 'select-up' : 'select-down'}`}  onClick={handleOpen}></i>
      </div>
      <div className="mutliSelect">
        {/* eslint-disable-next-line react/forbid-dom-props */}
        <ul ref={ulRef} style={{display: open ? 'block' : 'none'}} >
          {list.map((item, i) => (
            <li key={item.key} onClick={() => {
              handleCheck(i);
            }}>
              <input readOnly type="checkbox" defaultChecked={item.checked}/>
              <label title={item.key}>{item.value}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

SelectMultip.propTypes = {
  width: PropTypes.string,
  onClick: PropTypes.func,
  max: PropTypes.number,
  data(props, propName, componentName) {
    const data = props[propName];
    if (!(data && (Array.isArray(data) || typeof data == 'object'))) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`, expected \`array\` or \`object\`. `
      );
    }
  }
};

export default SelectMultip;