'use client'

import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, {
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType,
    Options
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
        width: width ?? 100,
        height: height ?? 100,
        type: 'svg' as DrawType,
        data: url,
        image: withImg ? '/beatleader.svg':undefined,
        margin: 2,
        qrOptions: {
          typeNumber: 0 as TypeNumber,
          mode: 'Byte' as Mode,
          errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.2,
          margin: 0,
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
      const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
      const ref = useRef<HTMLDivElement>(null);
    
      useEffect(() => {
        if (ref.current) {
          qrCode.append(ref.current);
        }
      }, [qrCode, ref]);
    
      useEffect(() => {
        if (!qrCode) return;
        qrCode.update(options);
      }, [qrCode, options]);
      return (
          <div ref={ref} className={className}/>
      );
}