"use client"
import BarcodeScanner from '@/components/BarcodeScanner'
import NewProductRegistrationDialog from '@/components/NewProductRegistrationDialog';
import ProductRegistrationDialog from '@/components/ProductRegistrationDialog';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useSWR from 'swr';



const page = () => {
  const stopped = useRef(false);
  const [newProductRegistrationData, setNewProductRegistrationData] = useState({});
  const [productRegistrationData, setProductRegistrationData] = useState({});
  
  const registerNewProduct = useCallback(
    (data) => {
      console.log(data);
      fetch(`/api/manage/scan/register-new-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((r) => r.json())
      .then(resp => {
        if (resp.error) {
          alert(resp.error);
          return;
        }
        console.log(resp);
        stopped.current = false;
        setNewProductRegistrationData({});
      })
    },
    [stopped.current]
  );

  const registerProduct = useCallback(
    (data) => {
      console.log(data);
      fetch(`/api/manage/scan/register-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((r) => r.json())
      .then(resp => {
        if (resp.error) {
          alert(resp.error);
          return;
        }
        console.log(resp);
        stopped.current = false;
        setProductRegistrationData({});
      })
    },
    [stopped.current]
  );

  const onUpdate = useCallback(
    (err, result) => {
      if (stopped.current) return;
      if (!result) return;

      stopped.current = true;
      fetch(`/api/manage/scan?code=${result.text}`)
      .then((r) => r.json())
      .then(resp => {
        if (resp.product_id){
          setProductRegistrationData({id: resp.product_id, ...resp});
          return;
        } else {
          setNewProductRegistrationData({code: result.text, ...resp});
        }
      })
    },
    [stopped.current]
  )

  return (
    <>
      <BarcodeScanner
        width={500}
        height={500}
        onUpdate={onUpdate}
      />
      <NewProductRegistrationDialog data={newProductRegistrationData} setData={setNewProductRegistrationData} close={() => stopped.current=false} registerNewProduct={registerNewProduct}/>
      <ProductRegistrationDialog data={productRegistrationData} setData={setProductRegistrationData} close={() => stopped.current=false} registerProduct={registerProduct}/>
    </>
  );
}

export default page