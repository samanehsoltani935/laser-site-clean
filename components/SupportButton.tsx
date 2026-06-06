import React from "react";
import Image from "next/image";

const SupportButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* متن کنار آیکون (بدون کادر) */}
      <span className="hidden md:block bg-white px-4 py-2 rounded-lg shadow-md text-sm font-semibold text-gray-700 animate-pulse-strong">
        پشتیبانی آنلاین
      </span>

      {/* آیکون به عنوان دکمه اصلی */}
      <a
        href="https://web.bale.ai/samanehsoltanis"
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-110 animate-pulse-strong"
      >
        <Image
          src="/images/bale-logo.png"
          alt="پشتیبانی بله"
          width={60} // سایز آیکونِ اصلی که تو عکس دیدم
          height={60}
          className="object-contain"
        />
      </a>
    </div>
  );
};

export default SupportButton;
