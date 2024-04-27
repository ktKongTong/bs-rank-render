'use client'

import React, {useEffect, useRef, useState} from "react";
import {QRCodeCanvas} from '@loskir/styled-qr-code-node';

import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  DrawType,
  ErrorCorrectionLevel,
  Mode,
  Options,
  TypeNumber
} from "qr-code-styling";

function blobToBase64(blob:Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
export default function ReplayQRCode(
  {
    url,
    withImg,
    width,
    height,
    className
  }:{

    url:string,
    width?:number,
    height?:number,
    withImg?:boolean,
    className?: string,
  }
){
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    fetch(`/api/qr?url=${encodeURIComponent(url)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.base64) {
          setImageSrc(data.base64);
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, []);
  return (
      <img src={imageSrc} width={width ?? 100} className={className}/>
  );
}