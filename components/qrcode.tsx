'use client'

import React, {useEffect, useRef, useState} from "react";
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
  const [options] = useState<Options>({
    width: width ?? 300,
    height: height ?? 300,
    type: 'canvas' as DrawType,
    data: url,
    image: withImg ? '/beatleader.svg':undefined,
    margin: 0,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.2,
      margin: 10,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: '#ffffff',
      type: 'rounded' as DotType
    },
    backgroundOptions: {
      color: 'rgb(0,0,0,0)',
    },
    cornersSquareOptions: {
      color: '#ffffff',
      type: 'extra-rounded' as CornerSquareType,
    },
    cornersDotOptions: {
      color: '#ffffff',
      type: 'dot' as CornerDotType,
    }
  });
  const it = new QRCodeStyling(options)
  const [qrCode] = useState<QRCodeStyling>(it);

  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null)
  function blobToBase64(blob:Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
  const [imgUrl,setImgUrl] = useState('')
  const setCanvas = async ()=> {
    const  data = await qrCode.getRawData('png')
    const res = await blobToBase64(data!)
    setImgUrl(res as any)
  }

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
    if(canvasRef.current) {
      setCanvas()
    }
  }, [qrCode, ref,canvasRef]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);
  return (
    <div>
      <canvas ref={canvasRef} width={width ?? 100} height={height ?? 100} className={'hidden'}/>
      <img src={imgUrl} width={width ?? 100} className={className}/>
    </div>

  );
}