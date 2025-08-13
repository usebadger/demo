import { useState } from "react";
import { FaCode } from "react-icons/fa";

export default function Code({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="absolute top-0 right-0 z-10">
        <button
          className="p-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaCode className="text-gray-400" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="bg-gray-100/95 p-4 rounded-lg shadow-lg overflow-y-auto max-h-full">
            <pre className="text-sm overflow-x-auto">
              <code>{children}</code>
            </pre>
          </div>
        </div>
      )}
    </>
  );
}
