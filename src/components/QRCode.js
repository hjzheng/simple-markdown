import React, { useState, useEffect } from "react";
import QRCodeUtil from "qrcode";

const QRCode = ({ url }) => {
  const [imgUrl, setImgUrl] = useState(null);

  const generateQR = async text => {
    try {
      const imgUrl = await QRCodeUtil.toDataURL(text);
      setImgUrl(imgUrl);
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect, useLayoutEffect and  componentDidMount componentDidUpdate componentWillUnmount
  useEffect(() => {
    generateQR(url);
  }, [url]);

  return imgUrl ? <img src={imgUrl} alt="qrcode" /> : null;
};

export default QRCode;
