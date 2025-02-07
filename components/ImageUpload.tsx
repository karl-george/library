'use client';

import config from '@/lib/config';
import { cn } from '@/lib/utils';
import { IKImage, IKUpload, ImageKitProvider } from 'imagekitio-next';
import Image from 'next/image';
import { useRef, useState } from 'react';

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        'Request failed with status: ' + response.status + ' ' + errorText
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const ImageUpload = () => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {};

  const onSuccess = () => {};

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className='hidden'
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName='test-upload.png'
      />

      <button
        className={cn('upload-btn')}
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src={'/icons/upload.svg'}
          alt='upload'
          width={20}
          height={20}
          className='object-contain'
        />
        <p className='text-base text-light-100'>Upload a file</p>

        {file && <p className='upload-filename'>{file.filePath}</p>}
      </button>

      {file && (
        <IKImage
          path={file.filePath}
          alt={file.filePath}
          width={500}
          height={500}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
