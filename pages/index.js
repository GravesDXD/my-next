import React,{useState} from 'react'
import SelectMutip from '../components/multiple';
import styles from '../styles/Home.module.css'
export default function Home(props) {
  const data = new Array(10).fill(1).map((iten,i)=>{
    return{
      key:i,
      value:`value-${i}`,
      // checked:false
    }
  })
  // console.log(data)
  return (
    <div className={styles.container}> 
      <SelectMutip data={data} max={1000}/>
  </div>
  )
}

