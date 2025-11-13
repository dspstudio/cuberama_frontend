import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center text-green-500">Payment Successful!</h1>
        <p className="mt-4 text-lg text-center text-gray-700 dark:text-gray-300">
          Thank you for your purchase. Your order has been processed successfully.
        </p>
        <div className="mt-8 text-center">
          <Link href="/" className="px-6 py-3 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
