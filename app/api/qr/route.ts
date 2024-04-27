// https://nextjs.org/docs/app/building-your-application/routing/router-handlers

import {NextRequest, NextResponse} from "next/server";

import { QRCodeCanvas, Options } from "@loskir/styled-qr-code-node";



export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if(!url) {
    return NextResponse.json(
      { error: "Failed to generate QR code, no url found" },
      { status: 500 }
    );
  }
  let it = decodeURIComponent(url)
  try {
    const options: Partial<Options> = {
      width: 400,
      height: 400,
      data: it,
      dotsOptions: {
        color: '#ffffff',
        type: 'rounded'
      },
      //   image: withImg ? '/beatleader.svg':undefined,
      backgroundOptions: {
        color: 'rgb(0,0,0,0)',
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.2,
        margin: 10,
        crossOrigin: 'anonymous',
      },
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q'
      },
      cornersSquareOptions: {
        color: '#ffffff',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#ffffff',
        type: 'dot',
      }
    };
    const qrCode = new QRCodeCanvas(options);
    const file = await qrCode.toDataUrl("png");
    return NextResponse.json({
      base64: file,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}