"use client"
import BarcodeScanner from '@/components/BarcodeScanner'
import NewProductRegistrationDialog from '@/components/NewProductRegistrationDialog';
import ProductRegistrationDialog from '@/components/ProductRegistrationDialog';
import { set } from 'date-fns';
import { Loader, LoaderCircle } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react'

const page = () => {
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
    [productRegistrationData, newProductRegistrationData]
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
        setProductRegistrationData({});
      })
    },
    [productRegistrationData, newProductRegistrationData]
  );

  const onUpdate = useCallback(
    (err, result) => {
      if (Object.keys({...productRegistrationData, ...newProductRegistrationData}).length > 0) return;
      if (!result) return;

      setScannedData(result);
      setNewProductRegistrationData({dummy: true});
      fetch(`/api/manage/scan?code=${result.text}`)
      .then((r) => r.json())
      .then(resp => {
        setScannedData(null);
        if (resp.product_id){
          setProductRegistrationData({id: resp.product_id, ...resp});
          setNewProductRegistrationData({});
        } else {
          setProductRegistrationData({});
          setNewProductRegistrationData({code: result.text, ...resp});
        }
      })
    },
    [productRegistrationData, newProductRegistrationData]
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
      <NewProductRegistrationDialog data={newProductRegistrationData} setData={setNewProductRegistrationData} close={() => setNewProductRegistrationData({})} registerNewProduct={registerNewProduct}/>
      <ProductRegistrationDialog data={productRegistrationData} setData={setProductRegistrationData} close={() => setProductRegistrationData({})} registerProduct={registerProduct}/>
    </>
  );
}

export default page