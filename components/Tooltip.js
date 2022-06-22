import React from 'react';
import ReactDom from 'react-dom'
const useState = React.useState;
const useEffect = React.useEffect;
const useRef = React.useRef;
const forwardRef = React.forwardRef;
const useImperativeHandle = React.useImperativeHandle;
const useLayoutEffect = React.useLayoutEffect;
// const domContainer = document.querySelector('#app');
// const body = document.querySelector('body');


/**
 * Tooltip 组件
 */
function RCTooltip(props) {
  return (
    <div>
      {props.message}
    </div>
  )
}

/**
 * 
 * @param {*} e 事件源
 * @param {*} className 被搜索class
 * @returns boolean 
 */
function findClassNameFromParent(e, className) {
  let i = true;
  let parentNode = e.target.parentNode || null;
  let res = false;
  while (i) {
    if (parentNode) {

      if (parentNode.className && parentNode.className.includes(className)) {
        res = true;
        i = false
      } else {
        parentNode = parentNode.parentNode;
      }
    } else {
      res = false;
      i = false;
    }
  }
  return res
}

/**
 * 将弹窗的控制权交给容器
 */
function TooltipWrap(props) {
  const [isShow, setIsShow] = useState(undefined);
  useEffect(() => {
    setIsShow(props.isOpen)
    console.log('change isOpen', props.isOpen)
  }, [props.isOpen]);

  useEffect(() => {
    const bodyClick = (e) => {
      if (!(e.target.className.includes('Tooltip') || findClassNameFromParent(e, 'Tooltip'))) {
        setIsShow(false)
        props.onVisibleChange && props.onVisibleChange(false)
      }
    }
    window.document.addEventListener('click', bodyClick)
    return () => { window.document.removeEventListener('click', bodyClick) }
  }, []);

  useEffect(() => {
    if (isShow === undefined) {
      setIsShow(props.defaultDisplayStatus);
      props.onVisibleChange && props.onVisibleChange(props.defaultDisplayStatus)
      return
    }
    setIsShow(!isShow)
    props.onVisibleChange && props.onVisibleChange(!isShow)
  }, [props.change]);

  return (
    <div
      className={`Tooltip ${isShow ? 'show' : 'hidden'}`}
      ref={props.RCTooltipRef}
    >
      <RCTooltip {...props}></RCTooltip>
    </div>
  )
}


/**
 * 将 Tooltip 插入到页面特定位置
 */
function Tooltip(props) {
  const el = <TooltipWrap {...props} ></TooltipWrap>
  return (
    props.DomNode && ReactDom.createPortal(
      el,
      props.DomNode
    )
  )
}


/**
 * Tooltip 的包裹组件
 */
function TooltipContent(props, ref) {
  const RCBtnRef = useRef(null)
  useImperativeHandle(ref, () => ({
    el: RCBtnRef.current,
    // el: ReactDOM.findDOMNode(RCBtnRef),
  }));
  const onclick = (e) => {
    e.nativeEvent.stopImmediatePropagation()
    props.changeTooltip()
  }
  console.log(props,'=====')
  return (
    // React.cloneElement(props.children,{ref:RCBtnRef,onClick:onclick})
    <div ref={RCBtnRef} onClick={onclick} id="RCBtn">{props.children}</div>
  )
}
TooltipContent = forwardRef(TooltipContent);

/**
 * 导出 Tooltip  
 */
export function MyTooltip(props) {
  const RCBtnRef = useRef(null);
  const RCTooltipRef = useRef(null);
  const [change, setChange] = useState(0);
  const [el, setEl] = useState(null);

  const init = () => {
    selectPosition(RCBtnRef, RCTooltipRef, props)
  }

  useEffect(() => {
    if (el === null) return
    const content = document.createElement('div')
    document.querySelector('body').appendChild(content)
    content.appendChild(el);
    init();
    window && window.addEventListener('scroll', (e) => {
      selectPosition(RCBtnRef, RCTooltipRef, props)
    });
    window.onresize = function () {
      init();
    }
    return () => {
      content.removeChild(el)
    }
  }, [el]);

  const changeTooltip = () => {
    // 单例模式
    if (!el) {
      setEl(document.createElement('div'))
    }
    setChange(change + 1);
  }

  // 如果设置了isOpen就需要提前创建tooltip的容器
  useEffect(() => {
    // 单例模式
    if (!el && props.isOpen) {
      setEl(document.createElement('div'))
    }
  }, [props.isOpen])

  return (
    <div>
      <TooltipContent ref={RCBtnRef} changeTooltip={changeTooltip}>
        {
          props.children
        }
      </TooltipContent>
      <Tooltip
        {...props}
        change={change}
        RCTooltipRef={RCTooltipRef}
        DomNode={el}
        defaultDisplayStatus={true}
      ></Tooltip>
    </div>
  );
}

/**
 * @param {*} position 
 */
function selectPosition(RCBtnRef, RCTooltipRef, props) {
  // 当页面的dom和所有微任务执行完成后 在获取Dom节点的各种属性
  setTimeout(() => {
    const RCBtnDom = RCBtnRef.current.el.children[0];// 当前RCBtn实例
    const RCTooltipDom = RCTooltipRef.current;// 当前RCTooltip实例
    const RCBtnDomStyles = RCBtnDom.getBoundingClientRect();
    const RCTooltipDomStyles = RCTooltipDom.getBoundingClientRect();
    const { width, left, top } = RCBtnDomStyles;
    const { width: RCTooltipWidth, height: RCTooltipHeight } = RCTooltipDomStyles;
    switch (props.position) {
      case 'top':
        RCTooltipDom.style.top = top - RCTooltipHeight + document.documentElement.scrollTop + 'px'
        RCTooltipDom.style.left = left + 'px'
        break;
      case 'right':
        RCTooltipDom.style.top = top + document.documentElement.scrollTop + 'px'
        RCTooltipDom.style.left = left + width + 'px'
        break;
      case 'top-center':
        RCTooltipDom.style.top = top - RCTooltipHeight + document.documentElement.scrollTop + 'px'
        RCTooltipDom.style.left = left - (RCTooltipWidth - width) / 2 + 'px'
        break;
      default:
        break;
    }
  }, 0)
}

export function Btn(props) {
  return <div className="Btn">{props.children}</div>
}

export function Tip(props) {

  return (
    <div>
      <div className="tip">{props.children}</div>
      <div onClick={props.onclick} className="close">X</div>
    </div>
  )
}

// function app() {
//   const [isOpen, setIsOpen] = useState(false);

//   const onclick = () => {
//     console.log('close')
//     setIsOpen(false)
//   }

//   const handleVisibleChange = (visible) => {
//     setIsOpen(visible);
//   }
//   return (
//     <React.Fragment>
//       <div className="container">
//         {/* 被提示的内容可以是组件或者元素 */}
//         <MyTooltip position="top" message="giao giao!">
//           <Btn>？</Btn>
//         </MyTooltip>

//         {/* 提示信息也可以是一个自定义的组件 */}
//         <MyTooltip position="right" message={<Btn>giao giao!</Btn>}>
//           <Btn>？</Btn>
//         </MyTooltip>

//         {/* 提供 isOpen 和 onVisibleChange 来控制提示窗的现实隐藏*/}
//         <MyTooltip position="top-center" isOpen={isOpen} onVisibleChange={handleVisibleChange} message={<Tip onclick={onclick}>giao giao!</Tip>}>
//           <Btn>？</Btn>
//         </MyTooltip>
//       </div>

//     </React.Fragment>
//   )
// }
