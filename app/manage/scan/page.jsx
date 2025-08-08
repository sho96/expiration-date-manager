"use client"
import BarcodeScanner from '@/components/BarcodeScanner'
import NewProductRegistrationDialog from '@/components/NewProductRegistrationDialog';
import ProductRegistrationDialog from '@/components/ProductRegistrationDialog';
import { Loader, LoaderCircle } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react'

const page = () => {
  const stopped = useRef(false);
  const [newProductRegistrationData, setNewProductRegistrationData] = useState({});
  const [productRegistrationData, setProductRegistrationData] = useState({});
  const [scannedData, setScannedData] = useState(false);
  
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
        setNewProductRegistrationData({});
        setProductRegistrationData({
          id: resp.product_id,
          ...data
        });
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

      setScannedData(result);
      stopped.current = true;
      fetch(`/api/manage/scan?code=${result.text}`)
      .then((r) => r.json())
      .then(resp => {
        setScannedData(null);
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
      <div className='flex flex-col items-center'>
        <div className="flex">
          {
            scannedData ? (
              <>
                <LoaderCircle className="animate-spin" />
                <h3 className='ml-2 text-lg font-semibold'>{scannedData.text}</h3>
              </>
            ) : (
              <h3 className='ml-2 text-lg font-semibold'>Scan a barcode</h3>
            )
          }
        </div>
        <BarcodeScanner
          width={500}
          height={500}
          onUpdate={onUpdate}
        />
      </div>
      <NewProductRegistrationDialog data={newProductRegistrationData} setData={setNewProductRegistrationData} close={() => stopped.current=false} registerNewProduct={registerNewProduct}/>
      <ProductRegistrationDialog data={productRegistrationData} setData={setProductRegistrationData} close={() => stopped.current=false} registerProduct={registerProduct}/>
    </>
  );
}

export default page