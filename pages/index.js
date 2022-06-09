import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Tip from '../components/tip/tip';
import { MyTooltip, Btn, Tip as TipCom } from '../components/Tooltip'
export default function Home(props) {
  console.log(props)

  const [isOpen, setIsOpen] = useState(false);

  const onclick = () => {
    console.log('close')
    setIsOpen(false)
  }

  const handleVisibleChange = (visible) => {
    setIsOpen(visible);
  }
  return (
    <div className={styles.container}>
      <MyTooltip position="top-center" isOpen={isOpen} onVisibleChange={handleVisibleChange} message={<TipCom onclick={onclick}>giao giao!</TipCom>}>
        <Btn>？</Btn>
      </MyTooltip>
      {/* <Tools postData={{}} placeholder='123' /> */}
    </div>
  )
}


Home.getInitialProps = async () => {
  const res = await axios.get('https://m.maizuo.com/gateway?cityId=440100&pageNum=1&pageSize=10&type=1&k=3452262', {
    headers: {
      'X-Host': 'mall.film-ticket.film.list'
    }
  })
  console.log(res)
  return {
    films: [...res.data.data.films]
  }
}
